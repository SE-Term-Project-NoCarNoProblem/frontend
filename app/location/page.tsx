"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BottomSheet from "../components/BottomSheet";
import { MapHandle } from "@/app/components/Map";
import { io } from "socket.io-client";
import { fetchWithAuth } from "../lib/api";
import { reverseGeocode } from "../lib/geocoding";
import ChooseRideCard from "../components/ChooseRideCard";
import LocationPicker from "../components/LocationPicker";
import RideRequestCard from "../components/RideFareCard";
import DriverInfoCard from "../components/DriverInfoCard";
import DriverStatusCard from "../components/DriverStatusCard";

interface Driver {
	driver_id: string;
	lat: number;
	lng: number;
	distance_m: number;
}

interface NearbyRequest {
	id: string;
	customer_id: string;
	service: string;
	fare?: number | null;
	distance_m?: number | null;
	requested_at: number;
	pickup_lng: number;
	pickup_lat: number;
	dropoff_lng: number;
	dropoff_lat: number;
	distance_to_driver_m: number;
}

interface UserRideRequest {
	id: string;
	customer_id: string;
	driver_id?: string | null;
	service: string;
	fare?: number | null;
	distance_m?: number | null;
	requested_at: number;
	pickup_lng: number;
	pickup_lat: number;
	dropoff_lng: number;
	dropoff_lat: number;
	status: string;
}

type UserMode = "customer" | "driver";

export default function Home() {
	const Map = useMemo(
		() =>
			dynamic(() => import("@/app/components/Map"), {
				loading: () => <p>A map is loading</p>,
				ssr: false,
			}),
		[]
	);

	const [userMode, setUserMode] = useState<UserMode>("customer");
	const [drivers, setDrivers] = useState<[number, number][]>([]);
	const [nearbyRequests, setNearbyRequests] = useState<NearbyRequest[]>([]);
	const [currentPosition, setCurrentPosition] = useState<
		[number, number] | null
	>(null);
	const [selectedRequest, setSelectedRequest] = useState<NearbyRequest | null>(
		null
	);
	const [driverView, setDriverView] = useState<"list" | "details" | "accepted">(
		"list"
	);
	const [customerView, setCustomerView] = useState<"select" | "waiting">(
		"select"
	);
	const [userRideRequest, setUserRideRequest] =
		useState<UserRideRequest | null>(null);
	const [acceptedRide, setAcceptedRide] = useState<NearbyRequest | null>(null);

	// Store socket and user ID in refs so they persist across renders
	const socketRef = useRef<ReturnType<typeof io> | null>(null);

	// Location state
	const [srcMarker, setSrcMarker] = useState<[number, number] | null>(null);
	const [srcAddress, setSrcAddress] = useState<string>("");
	const [srcQuery, setSrcQuery] = useState("");
	const [destMarker, setDestMarker] = useState<[number, number] | null>(null);
	const [destAddress, setDestAddress] = useState<string>("");
	const [destQuery, setDestQuery] = useState("");
	const [showFavorites, setShowFavorites] = useState(false);
	const [favoritesTarget, setFavoritesTarget] = useState<"src" | "dest" | null>(
		null
	);

	// Update addresses when markers change
	useEffect(() => {
		if (srcMarker) {
			reverseGeocode(srcMarker[0], srcMarker[1]).then((display_name) => {
				setSrcAddress(display_name);
				setSrcQuery(display_name);
			});
		}
	}, [srcMarker]);

	useEffect(() => {
		if (destMarker) {
			reverseGeocode(destMarker[0], destMarker[1]).then((display_name) => {
				setDestAddress(display_name);
				setDestQuery(display_name);
			});
		}
	}, [destMarker]);

	/* ### Forward geocoding / Search ### */
	async function handleSearch(type: "src" | "dest", query: string) {
		if (!query) return;

		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
			);
			const data = await res.json();

			if (data.length > 0) {
				const { lat, lon, display_name } = data[0];
				const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];

				if (type === "src") {
					setSrcMarker(coords);
					setSrcAddress(display_name);
				} else if (type === "dest") {
					setDestMarker(coords);
					setDestAddress(display_name);
				}
			} else {
				if (type === "src") {
					setSrcAddress("Location not found");
				} else if (type === "dest") {
					setDestAddress("Location not found");
				}
			}
		} catch (err) {
			console.error("Search error:", err);
			if (type === "src") {
				setSrcAddress("Error searching location");
			} else if (type === "dest") {
				setDestAddress("Error searching location");
			}
		}
	}

	function zoomOverall(lat1: number, lng1: number, lat2: number, lng2: number) {
		// Zoom map to encompass both locations
		if (mapRef.current) {
			// Calculate bounds
			const minLat = Math.min(lat1, lat2);
			const maxLat = Math.max(lat1, lat2);
			const minLng = Math.min(lng1, lng2);
			const maxLng = Math.max(lng1, lng2);

			// Add some padding (10%)
			const latPadding = (maxLat - minLat) * 0.1;
			const lngPadding = (maxLng - minLng) * 0.1;

			mapRef.current.fitBounds?.([
				[minLat - latPadding, minLng - lngPadding],
				[maxLat + latPadding, maxLng + lngPadding],
			]);
		}
	}

	// Initialize socket connection and fetch user profile
	useEffect(() => {
		// Create socket immediately so we can clean it up synchronously in the effect cleanup
		const socket = io(
			new URL(process.env.NEXT_PUBLIC_BACKEND_URL!).origin.replaceAll(
				"http",
				"ws"
			),
			{
				path: "/socket.io/",
				auth: {
					token: localStorage.getItem("token") || "",
				},
			}
		);

		socketRef.current = socket;

		socket.on("position:driver_positions", (data: Driver[]) => {
			console.log("Received driver positions:", data);
			setDrivers(data.map((d) => [d.lat, d.lng]));
		});

		// Cleanup runs synchronously when component unmounts
		return () => {
			console.log("Cleaning up socket...");
			try {
				socket.disconnect();
				socketRef.current = null;
			} catch (e) {
				console.error("Error disconnecting socket", e);
			}
		};
	}, []); // Only run once on mount

	useEffect(() => {
		if (userMode == "customer") {
			socketRef.current?.emit("position:remove_driver_position");
		}
		setSrcMarker(null);
		setDestMarker(null);

		// Check for existing ride request on page load (customer mode)
		const checkExistingRide = async () => {
			if (userMode !== "customer") return;

			try {
				const res = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/me/active`
				);

				if (!res.ok) {
					console.log("No active ride found");
					// No active ride found
					setCustomerView("select");
					setUserRideRequest(null);
					return;
				}

				const data = await res.json();

				// If user has an active ride, show DriverInfoCard
				// console.log(data, data.id);
				if (data && data.length > 0 && data[0].id) {
					setUserRideRequest(data);
					setCustomerView("waiting");

					// Set markers for the existing ride
					setSrcMarker([data[0].pickup_lat, data[0].pickup_lng]);
					setDestMarker([data[0].dropoff_lat, data[0].dropoff_lng]);
					zoomOverall(
						data[0].pickup_lat,
						data[0].pickup_lng,
						data[0].dropoff_lat,
						data[0].dropoff_lng
					);

					console.log("📍 Existing ride found:", data[0]);
				} else {
					setCustomerView("select");
					setUserRideRequest(null);
				}
			} catch (err) {
				console.error("Error checking existing ride:", err);
				setCustomerView("select");
				setUserRideRequest(null);
			}
		};

		checkExistingRide();
	}, [userMode]);

	// Send position to server when currentPosition updates (driver mode only)
	useEffect(() => {
		if (userMode === "driver" && currentPosition && socketRef.current) {
			console.log("sending position to server:", currentPosition);
			socketRef.current.emit("position:submit_driver_position", {
				position: currentPosition,
			});
		}
	}, [currentPosition, userMode]);

	const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMode = e.target.value as UserMode;
		setUserMode(newMode);
	};

	const [fare, setFare] = useState<number | null>(null);

	// Fetch nearby ride requests for drivers
	useEffect(() => {
		if (userMode !== "driver") {
			setNearbyRequests([]);
			return;
		}

		const fetchNearbyRequests = async () => {
			try {
				if (!currentPosition) return;

				const params = new URLSearchParams({
					lat: currentPosition[0].toString(),
					lng: currentPosition[1].toString(),
				});

				const res = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/nearby?${params}`
				);
				if (!res.ok) {
					throw new Error("Failed to fetch nearby requests");
				}
				const data = await res.json();
				setNearbyRequests(data);
				console.log("📍 Nearby requests:", data);
			} catch (err) {
				console.error("Error fetching nearby requests:", err);
				setNearbyRequests([]);
			}
		};

		fetchNearbyRequests();

		// Optionally, set up polling to refresh nearby requests periodically
		const interval = setInterval(fetchNearbyRequests, 10000); // Refresh every 10 seconds

		return () => clearInterval(interval);
	}, [userMode]);

	useEffect(() => {
		if (srcMarker && destMarker) {
			setFare(null);

			const fetchFare = async () => {
				try {
					const params = new URLSearchParams({
						pickup_lat: srcMarker[0].toString(),
						pickup_lng: srcMarker[1].toString(),
						dropoff_lat: destMarker[0].toString(),
						dropoff_lng: destMarker[1].toString(),
					});

					const res = await fetch(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/fare?${params}`
					);
					if (!res.ok) {
						throw new Error("Failed to fetch fare");
					}
					const data = await res.json();
					setFare(Math.round(data.fare_baht * 1.07));
				} catch (err) {
					console.error("Error fetching fare:", err);
				}
			};

			fetchFare();
		}
	}, [srcMarker, destMarker]);

	const mapRef = useRef<MapHandle>(null);

	const handleSelectRequest = (request: NearbyRequest) => {
		setSelectedRequest(request);
		setDriverView("details");

		// Set markers for pickup and dropoff
		setSrcMarker([request.pickup_lat, request.pickup_lng]);
		setDestMarker([request.dropoff_lat, request.dropoff_lng]);

		zoomOverall(
			request.pickup_lat,
			request.pickup_lng,
			request.dropoff_lat,
			request.dropoff_lng
		);
	};

	const handleBackToList = () => {
		setDriverView("list");
		setSelectedRequest(null);
		setAcceptedRide(null);
		setSrcMarker(null);
		setDestMarker(null);
		setSrcAddress("");
		setDestAddress("");
	};

	const handleAcceptRequest = async () => {
		if (!selectedRequest) return;

		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${selectedRequest.id}/accept`,
				{
					method: "POST",
				}
			);

			if (!res.ok) {
				throw new Error("Failed to accept ride request");
			}

			const data = await res.json();
			console.log("✅ Ride request accepted:", data);

			// Store the accepted ride and progress to accepted view
			setAcceptedRide(selectedRequest);
			setDriverView("accepted");
		} catch (err) {
			console.error("❌ Error accepting ride request:", err);
			alert("Failed to accept ride request. Please try again.");
		}
	};

	const handleRequestRide = async () => {
		if (!srcMarker || !destMarker) {
			alert("Please select both pickup and destination!");
			return;
		}

		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/`,
				{
					method: "POST",
					body: JSON.stringify({
						service: "car",
						note_to_driver: "",
						pickup_lat: srcMarker[0],
						pickup_lng: srcMarker[1],
						dropoff_lat: destMarker[0],
						dropoff_lng: destMarker[1],
					}),
				}
			);

			if (!res.ok) {
				throw new Error("Failed to create ride request");
			}

			const data = await res.json();
			console.log("✅ Ride requested:", data);

			// Store the ride request and switch to waiting view
			setUserRideRequest(data);
			setCustomerView("waiting");
		} catch (err) {
			console.error("❌ Error requesting ride:", err);
			alert("Failed to request ride. Please try again.");
		}
	};

	const handleCancelRide = async () => {
		if (!userRideRequest) return;

		const confirmed = confirm("Are you sure you want to cancel this ride?");
		if (!confirmed) return;

		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/${userRideRequest.id}`,
				{
					method: "DELETE",
				}
			);

			if (!res.ok) {
				throw new Error("Failed to cancel ride");
			}

			console.log("✅ Ride cancelled");

			// Reset to select view
			setCustomerView("select");
			setUserRideRequest(null);
			setSrcMarker(null);
			setDestMarker(null);
			setSrcAddress("");
			setDestAddress("");
		} catch (err) {
			console.error("❌ Error cancelling ride:", err);
			alert("Failed to cancel ride. Please try again.");
		}
	};

	return (
		<div>
			<Map
				ref={mapRef}
				drivers={drivers}
				userMode={userMode}
				onModeChange={handleModeChange}
				srcMarker={srcMarker}
				srcAddress={srcAddress}
				destMarker={destMarker}
				destAddress={destAddress}
				srcQuery={srcQuery}
				destQuery={destQuery}
				onSrcQueryChange={setSrcQuery}
				onDestQueryChange={setDestQuery}
				onSrcSearch={() => handleSearch("src", srcQuery)}
				onDestSearch={() => handleSearch("dest", destQuery)}
				onSrcMarkerSet={setSrcMarker}
				onDestMarkerSet={setDestMarker}
				showFavorites={showFavorites}
				favoritesTarget={favoritesTarget}
				onShowFavoritesChange={setShowFavorites}
				onFavoritesTargetChange={setFavoritesTarget}
				onCurrentPositionChange={setCurrentPosition}
				shouldShowInput={userMode === "customer" && customerView === "select"}
			/>
			{/* <BottomSheet onRequestRide={handleRequestRide}/> */}
			<div className="absolute bottom-0 left-0 right-0 w-full z-10">
				{userMode == "customer" &&
					customerView === "select" &&
					srcAddress &&
					destAddress &&
					fare && (
						<ChooseRideCard price={fare} onRequestRide={handleRequestRide} />
					)}
				{userMode == "customer" &&
					customerView === "waiting" &&
					userRideRequest && (
						<DriverInfoCard
							driver={{
								name: userRideRequest.driver_id
									? "Driver Assigned"
									: "Waiting for driver...",
								vehicle: "Toyota Camry",
								plateNumber: "ABC-1234",
								rating: 4.8,
								avatar: "D",
								status: userRideRequest.status || "accepted",
								estimatedArrival: "5 minutes",
							}}
							onMessageDriver={() => console.log("Message driver")}
							onCancel={handleCancelRide}
							showBackButton={false}
						/>
					)}
				{userMode == "driver" && driverView === "list" && (
					<LocationPicker
						nearbyRequests={nearbyRequests}
						onSelectRequest={handleSelectRequest}
					/>
				)}
				{userMode == "driver" &&
					driverView === "details" &&
					selectedRequest && (
						<RideRequestCard
							request={selectedRequest}
							onAccept={handleAcceptRequest}
							onBack={handleBackToList}
						/>
					)}
				{userMode == "driver" && driverView === "accepted" && acceptedRide && (
					<DriverStatusCard
						driver={{
							name: "Customer",
							vehicle: "Waiting for pickup",
							plateNumber: "-",
							rating: 0,
							avatar: "C",
							status: "accepted",
						}}
						isAccepted={true}
						onMessageDriver={() => console.log("Message customer")}
						onCancel={handleBackToList}
						showBackButton={true}
					/>
				)}
			</div>
		</div>
	);
}
