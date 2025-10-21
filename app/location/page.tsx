"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BottomSheet from "../components/BottomSheet";
import { MapHandle } from "@/app/components/Map";
import { io } from "socket.io-client";
import { fetchWithAuth } from "../lib/api";
import { reverseGeocode } from "../lib/geocoding";
import { haversineM } from "../lib/geo";
import ChooseRideCard from "../components/ChooseRideCard";
import LocationPicker from "../components/LocationPicker";
import RideRequestCard from "../components/RideFareCard";
import DriverStatusCard from "../components/DriverStatusCard";
import DriverActionCard from "../components/DriverActionCard";
import RateDriverModal from "../components/RateDriverModal";

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

interface ActiveRide {
	id: string;
	customer_id: string;
	driver_id: string;
	ride_status: string;
	ride_progress_status: "on_the_way" | "arrived" | "picked_up" | "completed";
	pickup_lat: number;
	pickup_lng: number;
	dropoff_lat: number;
	dropoff_lng: number;
	price: number;
	customer?: {
		id: string;
		user: {
			fullname: string;
			email: string;
			phone_number: string;
			profile_pic?: string;
		};
	};
	verified_driver?: {
		id: string;
		driver: {
			user: {
				fullname: string;
				email: string;
				phone_number: string;
				profile_pic?: string;
			};
		};
	};
	vehicle?: {
		id: string;
		registration: string;
		model: string;
		make: string;
		color: string;
	};
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
	const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
	const [rideStatus, setRideStatus] = useState<
		"on_the_way" | "arrived" | "picked_up" | "completed"
	>("on_the_way");
	const [showRatingModal, setShowRatingModal] = useState(false);
	const [completedRideForRating, setCompletedRideForRating] =
		useState<ActiveRide | null>(null);
	const [driverRating, setDriverRating] = useState<number>(4.9);

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

		// Listen for any ride event using a pattern
		socket.onAny((eventName, ...args) => {
			// Check for ride acceptance events
			const rideAcceptedMatch = eventName.match(/^ride:(.+):accepted$/);
			if (rideAcceptedMatch) {
				const rideId = rideAcceptedMatch[1];
				const data = args[0];
				console.log("Ride accepted event:", eventName, data);

				// Fetch full ride details if this is our ride
				setUserRideRequest((currentRequest) => {
					if (currentRequest?.id === rideId) {
						fetchRideDetails(rideId);
					}
					return currentRequest;
				});
			}

			// Check for ride status update events
			const statusUpdateMatch = eventName.match(/^ride:(.+):status_update$/);
			if (statusUpdateMatch) {
				const rideId = statusUpdateMatch[1];
				const data = args[0];
				console.log("Ride status update event:", eventName, data);

				setRideStatus(data.progress_status);
				setActiveRide((currentRide) => {
					if (currentRide && currentRide.id === rideId) {
						const updatedRide = {
							...currentRide,
							ride_progress_status: data.progress_status,
							ride_status: data.ride_status,
						} as ActiveRide;

						// If ride is completed and user is a customer, show rating modal
						if (
							data.progress_status === "completed" &&
							userMode === "customer"
						) {
							setCompletedRideForRating(updatedRide);

							// Fetch driver rating before showing modal
							if (updatedRide.driver_id) {
								fetchWithAuth(
									`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${updatedRide.driver_id}/rating`
								)
									.then((res) => res.json())
									.then((data) => {
										if (data.average_rating) {
											const ratingMatch = data.average_rating.match(/[\d.]+/);
											if (ratingMatch) {
												setDriverRating(parseFloat(ratingMatch[0]));
											}
										}
									})
									.catch((err) => {
										console.error("Error fetching driver rating:", err);
										setDriverRating(0); // Default if no rating
									})
									.finally(() => {
										setShowRatingModal(true);
									});
							} else {
								setShowRatingModal(true);
							}
						}

						return updatedRide;
					}
					return currentRide;
				});
			}

			// Check for ride canceled events
			const canceledMatch = eventName.match(/^ride:(.+):canceled$/);
			if (canceledMatch) {
				const rideId = canceledMatch[1];
				const data = args[0];
				console.log("Ride canceled event:", eventName, data);

				setActiveRide((currentRide) => {
					if (currentRide?.id === rideId) {
						alert("This ride has been cancelled");
						setCustomerView("select");
						setDriverView("list");
						setSrcMarker(null);
						setDestMarker(null);
						setSrcAddress("");
						setDestAddress("");
						setUserRideRequest(null);
						setAcceptedRide(null);
						return null;
					}
					return currentRide;
				});
			}
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
		const socket = socketRef.current;
		if (!socket) return;

		const handleRequestCreated = (data: any) => {
			console.log("New ride request created:", data);

			if (userMode !== "driver" || !currentPosition) return;

			setNearbyRequests((prevRequests) => {
				if (prevRequests.some((r) => r.id === data.id)) {
					return prevRequests;
				}

				const distanceToDriver = haversineM(
					currentPosition[0],
					currentPosition[1],
					data.pickup_lat,
					data.pickup_lng
				);

				if (distanceToDriver <= 3000) {
					// hardcode, grab from backend by Pun
					const newRequest: NearbyRequest = {
						id: data.id,
						customer_id: data.customer_id,
						service: data.service,
						fare: data.fare,
						distance_m: data.distance_m,
						requested_at: data.requested_at,
						pickup_lng: data.pickup_lng,
						pickup_lat: data.pickup_lat,
						dropoff_lng: data.dropoff_lng,
						dropoff_lat: data.dropoff_lat,
						distance_to_driver_m: Math.round(distanceToDriver),
					};

					const updated = [...prevRequests, newRequest].sort(
						(a, b) => a.distance_to_driver_m - b.distance_to_driver_m
					);
					return updated;
				}
				return prevRequests;
			});
		};

		const handleRequestCanceled = (data: {
			id: string;
			customer_id: string;
		}) => {
			console.log("Ride request canceled:", data);

			if (userMode !== "driver") return;

			setNearbyRequests((prevRequests) =>
				prevRequests.filter((r) => r.id !== data.id)
			);

			// If the canceled request was the one being viewed, go back to list
			setSelectedRequest((current) => {
				if (current?.id === data.id) {
					setDriverView("list");
					setSrcMarker(null);
					setDestMarker(null);
					return null;
				}
				return current;
			});
		};

		const handleRequestAccepted = (data: { id: string; driver_id: string }) => {
			console.log("Ride request accepted:", data);

			if (userMode !== "driver") return;

			setNearbyRequests((prevRequests) =>
				prevRequests.filter((r) => r.id !== data.id)
			);

			// If the accepted request was the one being viewed, go back to list
			setSelectedRequest((current) => {
				if (current?.id === data.id) {
					setDriverView("list");
					setSrcMarker(null);
					setDestMarker(null);
					return null;
				}
				return current;
			});
		};

		socket.on("request:created", handleRequestCreated);
		socket.on("request:canceled", handleRequestCanceled);
		socket.on("request:accepted", handleRequestAccepted);

		// Cleanup
		return () => {
			socket.off("request:created", handleRequestCreated);
			socket.off("request:canceled", handleRequestCanceled);
			socket.off("request:accepted", handleRequestAccepted);
		};
	}, [userMode, currentPosition]);

	useEffect(() => {
		if (userMode == "customer") {
			socketRef.current?.emit("position:remove_driver_position");
		}
		setSrcMarker(null);
		setDestMarker(null);

		// Check for existing ride request on page load
		const checkExistingRide = async () => {
			try {
				// First check for accepted/ongoing rides
				// We would need an API endpoint to get current user's active ride
				// For now, check for ride requests

				if (userMode === "customer") {
					const res = await fetchWithAuth(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/me/active`
					);

					if (res.ok) {
						const data = await res.json();

						if (data && data.length > 0 && data[0].id) {
							const rideRequest = data[0];
							setUserRideRequest(rideRequest);

							// Check if this request has been accepted (try fetching as a ride)
							try {
								const rideRes = await fetchWithAuth(
									`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideRequest.id}`
								);

								if (rideRes.ok) {
									const rideData: ActiveRide = await rideRes.json();
									setActiveRide(rideData);
									setRideStatus(rideData.ride_progress_status);
									console.log("📍 Existing active ride found:", rideData);
								}
							} catch (err) {
								console.log("Request not yet accepted");
							}

							setCustomerView("waiting");

							// Set markers for the existing ride
							setSrcMarker([rideRequest.pickup_lat, rideRequest.pickup_lng]);
							setDestMarker([rideRequest.dropoff_lat, rideRequest.dropoff_lng]);
							zoomOverall(
								rideRequest.pickup_lat,
								rideRequest.pickup_lng,
								rideRequest.dropoff_lat,
								rideRequest.dropoff_lng
							);

							console.log("📍 Existing ride request found:", rideRequest);
						} else {
							setCustomerView("select");
							setUserRideRequest(null);
							setActiveRide(null);
						}
					} else {
						setCustomerView("select");
						setUserRideRequest(null);
						setActiveRide(null);
					}
				} else if (userMode === "driver") {
					// Driver mode - no need to check for existing rides on load
					setDriverView("list");
				}
			} catch (err) {
				console.error("Error checking existing ride:", err);
				if (userMode === "customer") {
					setCustomerView("select");
					setUserRideRequest(null);
					setActiveRide(null);
				}
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

	// Fetch nearby ride requests for drivers (initial load only, updates via Socket.IO)
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

		// No polling needed - Socket.IO will handle real-time updates
	}, [userMode, currentPosition]);

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

	// Fetch full ride details
	const fetchRideDetails = async (rideId: string) => {
		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideId}`
			);
			if (!res.ok) {
				throw new Error("Failed to fetch ride details");
			}
			const rideData: ActiveRide = await res.json();
			console.log("✅ Fetched ride details:", rideData);

			setActiveRide(rideData);
			setRideStatus(rideData.ride_progress_status);

			// Update view based on user mode
			if (userMode === "customer") {
				setCustomerView("waiting");
			} else if (userMode === "driver") {
				setDriverView("accepted");
			}
		} catch (err) {
			console.error("❌ Error fetching ride details:", err);
		}
	};

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

			// Store the accepted ride and fetch full ride details
			setAcceptedRide(selectedRequest);
			setDriverView("accepted");

			// Fetch full ride details
			await fetchRideDetails(selectedRequest.id);
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
		// Determine which ride to cancel
		const rideIdToCancel = activeRide?.id || userRideRequest?.id;

		if (!rideIdToCancel) return;

		const confirmed = confirm("Are you sure you want to cancel this ride?");
		if (!confirmed) return;

		try {
			// If ride has been accepted (has activeRide), cancel via rides endpoint
			if (activeRide) {
				const res = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideIdToCancel}`,
					{
						method: "DELETE",
					}
				);

				if (!res.ok) {
					throw new Error("Failed to cancel ongoing ride");
				}

				console.log("✅ Ongoing ride cancelled");
			} else if (userRideRequest) {
				// If ride request hasn't been accepted yet, cancel via requests endpoint
				const res = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/${rideIdToCancel}`,
					{
						method: "DELETE",
					}
				);

				if (!res.ok) {
					throw new Error("Failed to cancel ride request");
				}

				console.log("✅ Ride request cancelled");
			}

			// Reset to select/list view
			setCustomerView("select");
			setDriverView("list");
			setUserRideRequest(null);
			setActiveRide(null);
			setAcceptedRide(null);
			setSrcMarker(null);
			setDestMarker(null);
			setSrcAddress("");
			setDestAddress("");
		} catch (err) {
			console.error("❌ Error cancelling ride:", err);
			alert("Failed to cancel ride. Please try again.");
		}
	};

	// Handler for driver to update ride status
	const handleDriverStatusUpdate = async (
		newStatus: "arrived" | "picked_up" | "completed"
	) => {
		if (!activeRide) return;

		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${activeRide.id}/status`,
				{
					method: "PATCH",
					body: JSON.stringify({
						progress_status: newStatus,
					}),
				}
			);

			if (!res.ok) {
				throw new Error("Failed to update ride status");
			}

			const data = await res.json();
			console.log("✅ Ride status updated:", data);

			// Update local state
			setRideStatus(newStatus);
			setActiveRide({
				...activeRide,
				ride_progress_status: newStatus,
			});

			// If completed, show success message and reset after a delay
			if (newStatus === "completed") {
				setTimeout(() => {
					alert("Ride completed successfully! 🎉");
					setDriverView("list");
					setActiveRide(null);
					setAcceptedRide(null);
					setSrcMarker(null);
					setDestMarker(null);
					setSrcAddress("");
					setDestAddress("");
				}, 2000);
			}
		} catch (err) {
			console.error("❌ Error updating ride status:", err);
			alert("Failed to update ride status. Please try again.");
		}
	};

	// Handler for submitting driver rating
	const handleRatingSubmit = async (rating: number) => {
		if (!completedRideForRating) return;

		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${completedRideForRating.id}/rating`,
				{
					method: "PUT",
					body: JSON.stringify({
						rating: rating,
					}),
				}
			);

			if (!res.ok) {
				throw new Error("Failed to submit rating");
			}

			console.log("✅ Rating submitted successfully:", rating);

			// Close modal and reset ride state
			setShowRatingModal(false);
			setCompletedRideForRating(null);
			setActiveRide(null);
			setUserRideRequest(null);
			setCustomerView("select");
			setSrcMarker(null);
			setDestMarker(null);
			setSrcAddress("");
			setDestAddress("");

			// Show success message
			alert("Thank you for your feedback! 🎉");
		} catch (err) {
			console.error("❌ Error submitting rating:", err);
			alert("Failed to submit rating. Please try again.");
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
				{/* Customer view - Select locations and request ride */}
				{userMode == "customer" &&
					customerView === "select" &&
					srcAddress &&
					destAddress &&
					fare && (
						<ChooseRideCard price={fare} onRequestRide={handleRequestRide} />
					)}

				{/* Customer view - Waiting for driver or ride in progress */}
				{userMode == "customer" &&
					customerView === "waiting" &&
					(activeRide || userRideRequest) && (
						<DriverStatusCard
							driver={{
								name:
									activeRide?.verified_driver?.driver.user.fullname ||
									"Waiting for driver...",
								vehicle: activeRide?.vehicle
									? `${activeRide.vehicle.make} ${activeRide.vehicle.model} (${activeRide.vehicle.color})`
									: "Searching...",
								plateNumber: activeRide?.vehicle?.registration || "-",
								rating: 4.8,
								avatar:
									activeRide?.verified_driver?.driver.user.fullname?.charAt(
										0
									) || "D",
								avatarImage:
									activeRide?.verified_driver?.driver.user.profile_pic,
								status: activeRide?.ride_progress_status || "waiting",
								estimatedArrival: "5 minutes",
							}}
							isAccepted={!!activeRide}
							onMessageDriver={() => console.log("Message driver")}
							onCancel={handleCancelRide}
							showBackButton={false}
						/>
					)}

				{/* Driver view - List of nearby ride requests */}
				{userMode == "driver" && driverView === "list" && (
					<LocationPicker
						nearbyRequests={nearbyRequests}
						onSelectRequest={handleSelectRequest}
					/>
				)}

				{/* Driver view - Request details before accepting */}
				{userMode == "driver" &&
					driverView === "details" &&
					selectedRequest && (
						<RideRequestCard
							request={selectedRequest}
							onAccept={handleAcceptRequest}
							onBack={handleBackToList}
						/>
					)}

				{/* Driver view - Accepted ride with action buttons */}
				{userMode == "driver" && driverView === "accepted" && activeRide && (
					<DriverActionCard
						customer={{
							name: activeRide.customer?.user.fullname || "Customer",
							pickupAddress: srcAddress || "Pickup location",
							dropoffAddress: destAddress || "Dropoff location",
							avatar: activeRide.customer?.user.fullname?.charAt(0) || "C",
							avatarImage: activeRide.customer?.user.profile_pic,
						}}
						rideStatus={rideStatus}
						onStatusUpdate={handleDriverStatusUpdate}
						onCancel={handleCancelRide}
						onMessageCustomer={() => console.log("Message customer")}
					/>
				)}
			</div>

			{/* Rating Modal - Shows when ride is completed (customer view) */}
			{showRatingModal && completedRideForRating && (
				<RateDriverModal
					driverName={
						completedRideForRating.verified_driver?.driver.user.fullname ||
						"Driver"
					}
					driverAvatar={
						completedRideForRating.verified_driver?.driver.user.profile_pic
					}
					driverInitials={
						completedRideForRating.verified_driver?.driver.user.fullname?.charAt(
							0
						) || "D"
					}
					currentRating={driverRating}
					onSubmit={handleRatingSubmit}
				/>
			)}
		</div>
	);
}
