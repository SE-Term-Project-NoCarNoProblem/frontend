"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

interface LocationOption {
	id: string;
	name: string;
	distanceFromUser: string;
	timeFromUser: string;
	pickupPoint: string;
	distanceFromPickup: string;
	timeFromPickup: string;
}

interface LocationPickerProps {
	nearbyRequests?: NearbyRequest[];
}

const LocationPicker = ({ nearbyRequests = [] }: LocationPickerProps) => {
	const router = useRouter();
	const [selectedSort, setSelectedSort] = useState("Nearest pick-up");
	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
		null
	);
	const [locations, setLocations] = useState<LocationOption[]>([]);

	// Reverse geocoding function
	const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
			);
			const data = await res.json();
			return data.display_name || "Unknown location";
		} catch (err) {
			console.error("Reverse geocode error:", err);
			return "Unknown location";
		}
	};

	// Convert nearby requests to location options
	useEffect(() => {
		const convertRequests = async () => {
			if (!nearbyRequests || nearbyRequests.length === 0) {
				setLocations([]);
				return;
			}

			const convertedLocations = await Promise.all(
				nearbyRequests.map(async (request) => {
					const [pickupName, dropoffName] = await Promise.all([
						reverseGeocode(request.pickup_lat, request.pickup_lng),
						reverseGeocode(request.dropoff_lat, request.dropoff_lng),
					]);

					// Calculate estimated time based on distance (assuming 40 km/h average speed)
					const distanceToDriverKm = request.distance_to_driver_m / 1000;
					const timeToPickupMinutes = Math.round(
						(distanceToDriverKm / 40) * 60
					);

					const distanceKm = request.distance_m ? request.distance_m / 1000 : 0;
					const tripTimeMinutes = Math.round((distanceKm / 40) * 60);

					return {
						id: request.id,
						name: dropoffName,
						distanceFromUser: `${distanceToDriverKm.toFixed(1)} km from your location`,
						timeFromUser: `${timeToPickupMinutes} minutes away`,
						pickupPoint: pickupName,
						distanceFromPickup: `${distanceKm.toFixed(1)} km from pick-up`,
						timeFromPickup: `${tripTimeMinutes} minutes`,
					};
				})
			);

			setLocations(convertedLocations);
		};

		convertRequests();
	}, [nearbyRequests]);

	const handleBackClick = () => {
		router.back(); //Goes back to previous page
		// Or use router.push('/') to go to a specific page
	};

	return (
		<div className="w-full mx-auto max-w-[393px] h-[441px] bg-white flex flex-col shadow-lg rounded-[10px] overflow-hidden">
			{/* Upper Bar */}
			<div className="flex justify-center pt-2">
				<Image src="/upper bar.svg" alt="Upper bar" width={148} height={4} />
			</div>

			{/* Header */}
			<div className="flex items-center px-4 py-3">
				<button
					className="p-1 text-[#0E4663]"
					aria-label="Go back"
					onClick={handleBackClick}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#0E4663"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
				</button>

				<div className="flex-1 flex justify-end">
					<button
						className="flex items-center gap-1 text-xs bg-[#F8F8F8] px-3 py-2 rounded-md hover:bg-[#E8E8E8] active:bg-[#D8D8D8] transition-colors text-[#0E4663]"
						onClick={() => console.log("Sort clicked")}
					>
						<span>{selectedSort}</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							stroke="#0E4663"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M4 6l4 4 4-4" />
						</svg>
					</button>
				</div>
			</div>

			{/* Location List */}
			<div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center gap-4">
				{locations.length === 0 ? (
					<div className="text-center py-8 text-[#0E4663]">
						<p className="text-sm">No nearby ride requests available</p>
					</div>
				) : (
					locations.map((location, index) => (
						<button
							key={location.id}
							onClick={() => setSelectedLocationId(location.id)}
							className={`w-full max-w-[345px] rounded-lg p-4 text-left transition-colors ${
								selectedLocationId === location.id
									? "bg-[#D8D8D8]"
									: "bg-[#F8F8F8] hover:bg-[#E8E8E8] active:bg-[#D8D8D8]"
							}`}
						>
							{/* Destination */}
							<div className="flex items-start gap-3 mb-2">
								<div className="mt-1">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="#DC2626"
										stroke="#DC2626"
										strokeWidth="0"
									>
										<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-[#0E4663] text-sm mb-1">
										{location.name}
									</h3>
									<p className="text-xs text-[#0E4663]">
										{location.distanceFromUser} ( {location.timeFromUser} )
									</p>
								</div>
							</div>

							{/* Pickup Point */}
							<div className="flex items-start gap-3">
								<div className="mt-1">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="#059669"
										stroke="#059669"
										strokeWidth="0"
									>
										<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-[#0E4663] text-sm mb-1">
										{location.pickupPoint}
									</h3>
									<p className="text-xs text-[#0E4663]">
										{location.distanceFromPickup} ( {location.timeFromPickup} )
									</p>
								</div>
							</div>
						</button>
					))
				)}
			</div>
		</div>
	);
};

export default LocationPicker;
