"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type VehicleType = "motorcycle" | "car" | "van";

interface ChooseRideCardProps {
	rideType?: string;
	capacity?: string;
	price?: number;
	currency?: string;
	pricesByType?: Partial<Record<VehicleType, number>>;
	onBack?: () => void;
	onRequestRide?: (type: VehicleType) => void;
	showBackButton?: boolean;
}


const ChooseRideCard = ({
	rideType = "Car ride",
	capacity = "3 people",
	price = 120,
	currency = "Baht",
	pricesByType,
	onBack,
	onRequestRide,
	showBackButton = true,
}: ChooseRideCardProps) => {
	const router = useRouter();
	const [selectedType, setSelectedType] = useState<VehicleType>("car");

	const rideOptions: {
		type: VehicleType;
		label: string;
		capacity: string;
		icon: string;
	}[] = [
			{
				type: "motorcycle",
				label: "Motorcycle ride",
				capacity: "1 person",
				icon: "/motorcycle.svg",
			},
			{
				type: "car",
				label: rideType,
				capacity,
				icon: "/car.svg",
			},
			{
				type: "van",
				label: "Van ride",
				capacity: "6 people",
				icon: "/van.svg",
			},
		];


	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	const handleRequestRide = () => {
		if (onRequestRide) {
			onRequestRide(selectedType);
		} else {
			router.push("/ride-request");
		}
	};


	return (
		<div className="w-full mx-auto max-w-[393px] bg-white rounded-t-3xl shadow-lg p-4 flex flex-col">
			{/* Upper Bar */}
			<div className="flex justify-center mb-2">
				<Image src="/upper bar.svg" alt="Upper bar" width={148} height={4} />
			</div>

			{/* Header with Back Button */}
			<div className="flex items-center mb-3">
				{showBackButton && (
					<button
						onClick={handleBack}
						className="mr-2 text-[#0E4663] hover:text-[#0A3A50] transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				)}
				<h2 className="text-xl font-bold text-[#0E4663] flex-1 text-center mr-6">
					Choose a ride
				</h2>
			</div>

			{/* Ride Option Boxes */}
			<div className="space-y-2 mb-3">
				{rideOptions.map((option) => {
					const isSelected = selectedType === option.type;
					const priceToShow =
						pricesByType?.[option.type] ?? price; // fallback to single price

					return (
						<button
							key={option.type}
							type="button"
							onClick={() => setSelectedType(option.type)}
							className={`w-full border-2 rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer ${isSelected
								? "border-[#0E4663] bg-[#E8F1F5]"
								: "border-gray-300 hover:border-[#0E4663]"
								}`}
						>
							{/* Icon + details */}
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 flex items-center justify-center">
									<Image
										src={option.icon}
										alt={option.label}
										width={48}
										height={48}
										className="object-contain"
									/>
								</div>
								<div>
									<h3 className="text-base font-bold text-[#0E4663]">
										{option.label}
									</h3>
									<p className="text-sm text-gray-600">{option.capacity}</p>
								</div>
							</div>

							{/* Price */}
							<div className="flex items-center gap-2">
								<div className="text-right">
									<p className="text-lg font-bold text-[#0E4663]">
										{priceToShow} {currency}
									</p>
									<p className="text-xs text-gray-500">after tax</p>
								</div>
							</div>
						</button>
					);
				})}
			</div>


			{/* Request Button */}
			<button
				onClick={handleRequestRide}
				className="w-[342px] h-[40px] bg-[#0E4663] text-white rounded-xl text-lg font-bold hover:bg-[#0A3A50] transition-colors mx-auto"
			>
				Request a ride
			</button>
		</div>
	);
};

export default ChooseRideCard;
