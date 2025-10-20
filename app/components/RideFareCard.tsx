"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { reverseGeocode } from "../lib/geocoding";

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

interface RideRequestCardProps {
	request: NearbyRequest;
	passengerInitial?: string;
	onAccept?: () => void;
	onBack?: () => void;
}

const RideRequestCard = ({
	request,
	passengerInitial = "K",
	onAccept,
	onBack,
}: RideRequestCardProps) => {
	const router = useRouter();
	const [pickupAddress, setPickupAddress] = useState("Loading...");
	const [dropoffAddress, setDropoffAddress] = useState("Loading...");

	// Fetch addresses on component mount
	useEffect(() => {
		const fetchAddresses = async () => {
			const [pickup, dropoff] = await Promise.all([
				reverseGeocode(request.pickup_lat, request.pickup_lng),
				reverseGeocode(request.dropoff_lat, request.dropoff_lng),
			]);
			setPickupAddress(pickup);
			setDropoffAddress(dropoff);
		};

		fetchAddresses();
	}, [request]);

	// Calculate distances and times (same logic as LocationPicker)
	const distanceToDriverKm = request.distance_to_driver_m / 1000;
	const timeToPickupMinutes = Math.round((distanceToDriverKm / 40) * 60);

	const tripDistanceKm = request.distance_m ? request.distance_m / 1000 : 0;
	const tripTimeMinutes = Math.round((tripDistanceKm / 40) * 60);

	const handleBackClick = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	const handleAccept = () => {
		if (onAccept) {
			onAccept();
		} else {
			console.log("Passenger accepted");
		}
	};

	return (
		<div className="w-full mx-auto max-w-[393px] bg-white flex flex-col shadow-lg rounded-[10px] overflow-hidden">
			{/* Upper Bar */}
			<div className="flex justify-center pt-2">
				<Image src="/upper bar.svg" alt="Upper bar" width={148} height={4} />
			</div>

			{/* Header */}
			<div className="flex items-center px-4 py-2">
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
			</div>

			{/* Content */}
			<div className="flex-1 px-6 py-1">
				{/* Location Info */}
				<div className="bg-[#F8F8F8] rounded-lg p-3 mb-3">
					{/* Pickup Point */}
					<div className="flex items-start gap-3">
						<div className="mt-1 relative">
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
							{/* Dashed Line */}
							<div className="absolute left-1/2 -translate-x-1/2 top-[20px] w-0 h-[28px] border-l-2 border-dashed border-[#0E4663] opacity-30"></div>
						</div>
						<div className="flex-1 mb-2">
							<h3 className="font-bold text-[#0E4663] text-sm mb-1">
								{pickupAddress}
							</h3>
							<p className="text-xs text-[#0E4663]">
								{distanceToDriverKm.toFixed(1)} km from your location (
								{timeToPickupMinutes} minutes away)
							</p>
						</div>
					</div>

					{/* Destination */}
					<div className="flex items-start gap-3">
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
								{dropoffAddress}
							</h3>
							<p className="text-xs text-[#0E4663]">
								{tripDistanceKm.toFixed(1)} km from pick-up ({tripTimeMinutes}{" "}
								minutes)
							</p>
						</div>
					</div>
				</div>

				{/* Estimated Fare */}
				<div className="bg-[#F8F8F8] rounded-lg p-3 mb-3">
					<p className="text-[#0E4663] font-bold text-lg text-center">
						Estimated Fare : {request.fare || 0} THB
					</p>
				</div>
			</div>

			{/* Accept Button */}
			<div className="flex justify-center pb-5">
				<button
					onClick={handleAccept}
					className="w-[357px] h-[40px] bg-[#0E4663] hover:bg-[#0A3347] active:bg-[#072632] text-white font-semibold rounded-lg transition-colors text-base"
				>
					Accept this passenger
				</button>
			</div>
		</div>
	);
};

export default RideRequestCard;
