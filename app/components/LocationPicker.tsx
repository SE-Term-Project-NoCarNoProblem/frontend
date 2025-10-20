"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LocationOption {
	id: string;
	name: string;
	distanceFromUser: string;
	timeFromUser: string;
	pickupPoint: string;
	distanceFromPickup: string;
	timeFromPickup: string;
}

const LocationPicker = () => {
	const router = useRouter();
	const [selectedSort, setSelectedSort] = useState("Nearest pick-up");
	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
		null
	);

	const handleBackClick = () => {
		router.back(); //Goes back to previous page
		// Or use router.push('/') to go to a specific page
	};

	const locations: LocationOption[] = [
		{
			id: "1",
			name: "Faculty of Engineering Chula u.",
			distanceFromUser: "1.2 km from your location",
			timeFromUser: "10 minutes away",
			pickupPoint: "Siam Paragon",
			distanceFromPickup: "2.2 km from pick-up",
			timeFromPickup: "30 minutes",
		},
		{
			id: "2",
			name: "อุทยาน 100 ปี",
			distanceFromUser: "1.8 km from your location",
			timeFromUser: "20 minutes away",
			pickupPoint: "Central World",
			distanceFromPickup: "2.5 km from pick-up",
			timeFromPickup: "35 minutes",
		},
		{
			id: "3",
			name: "Faculty of Engineering Chula u.",
			distanceFromUser: "1.2 km from your location",
			timeFromUser: "10 minutes away",
			pickupPoint: "Siam Paragon",
			distanceFromPickup: "2.2 km from pick-up",
			timeFromPickup: "30 minutes",
		},
	];

	return (
		<div className="w-full max-w-[393px] h-[441px] bg-white flex flex-col shadow-lg rounded-[10px] overflow-hidden">
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
				{locations.map((location, index) => (
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
				))}
			</div>
		</div>
	);
};

export default LocationPicker;
