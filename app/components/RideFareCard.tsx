"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RideRequestCardProps {
	destination?: string;
	destinationDistance?: string;
	destinationTime?: string;
	pickupPoint?: string;
	pickupDistance?: string;
	pickupTime?: string;
	estimatedFare?: number;
	passengerInitial?: string;
	onAccept?: () => void;
}

const RideRequestCard = ({
	destination = "Faculty of Engineering Chula u.",
	destinationDistance = "1.2 km from your location",
	destinationTime = "10 minutes away",
	pickupPoint = "Siam Paragon",
	pickupDistance = "2.2 km from pick-up",
	pickupTime = "30 minutes",
	estimatedFare = 60,
	passengerInitial = "K",
	onAccept,
}: RideRequestCardProps) => {
	const router = useRouter();

	const handleBackClick = () => {
		router.back();
	};

	const handleAccept = () => {
		if (onAccept) {
			onAccept();
		} else {
			console.log("Passenger accepted");
		}
	};

	return (
		<div className="w-full max-w-[393px] h-[314px] bg-white flex flex-col shadow-lg rounded-[10px] overflow-hidden">
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
								{destination}
							</h3>
							<p className="text-xs text-[#0E4663]">
								{destinationDistance} ( {destinationTime} )
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
								{pickupPoint}
							</h3>
							<p className="text-xs text-[#0E4663]">
								{pickupDistance} ({pickupTime})
							</p>
						</div>
					</div>
				</div>

				{/* Estimated Fare */}
				<div className="bg-[#F8F8F8] rounded-lg p-3 mb-3">
					<p className="text-[#0E4663] font-bold text-lg text-center">
						Estimated Fare : {estimatedFare} THB
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
