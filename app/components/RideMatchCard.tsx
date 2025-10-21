"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RideMatchCardProps {
	driverName?: string;
	driverInitials?: string;
	vehicle?: string;
	plateNumber?: string;
	rating?: number;
	destination?: string;
	pickupPoint?: string;
	onBack?: () => void;
}

const RideMatchCard = ({
	driverName = "Sippakorn Thunyahan",
	driverInitials = "ST",
	vehicle = "Honda civic (Black)",
	plateNumber = "กก 1234",
	rating = 4.9,
	destination = "Faculty of Engineering Chula u.",
	pickupPoint = "Siam Paragon",
	onBack,
}: RideMatchCardProps) => {
	const router = useRouter();

	const handleBackClick = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	return (
		<div className="w-full max-w-[399px] h-[209px] bg-white flex flex-col shadow-lg rounded-[10px] overflow-hidden">
			{/* Upper Bar */}
			<div className="flex justify-center pt-2">
				<Image src="/upper bar.svg" alt="Upper bar" width={148} height={4} />
			</div>

			{/* Content */}
			<div className="px-6 pb-4 pt-3 flex-1 flex flex-col justify-between">
				{/* Driver Info Section */}
				<div className="flex items-start gap-4">
					{/* Driver Details with Back Arrow */}
					<div className="flex-1 flex flex-col gap-4">
						<div className="flex items-start gap-2">
							<button
								className="text-[#0E4663] mt-0.5"
								aria-label="Go back"
								onClick={handleBackClick}
							>
								<svg
									width="20"
									height="20"
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
							<div className="flex-1">
								<h2 className="text-[#0E4663] font-bold text-base mb-1.5">
									{driverName}
								</h2>
								<p className="text-[#0E4663] text-xs">
									{vehicle} : {plateNumber}
								</p>
							</div>
						</div>

						{/* Location Info */}
						<div className="pl-7 space-y-5">
							{/* Destination */}
							<div className="flex items-center gap-3">
								<div>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="#DC2626"
										stroke="#DC2626"
										strokeWidth="0"
									>
										<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-[#0E4663] text-sm">
										{destination}
									</h3>
								</div>
							</div>

							{/* Pickup Point */}
							<div className="flex items-center gap-3">
								<div>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="#059669"
										stroke="#059669"
										strokeWidth="0"
									>
										<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-[#0E4663] text-sm">
										{pickupPoint}
									</h3>
								</div>
							</div>
						</div>
					</div>

					{/* Driver Avatar and Rating */}
					<div className="relative flex-shrink-0">
						<div className="w-16 h-16 bg-[#0E4663] rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-xl">
								{driverInitials}
							</span>
						</div>
						{/* Rating Badge */}
						<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#0E4663] text-white text-xs font-semibold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-0.5">
							<span>{rating}</span>
							<svg
								width="10"
								height="10"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
									fill="#EAB401"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RideMatchCard;
