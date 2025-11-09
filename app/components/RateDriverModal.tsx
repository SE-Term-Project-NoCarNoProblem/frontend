"use client";

import React, { useState } from "react";
import Image from "next/image";

interface RateDriverModalProps {
	driverName: string;
	driverAvatar?: string;
	driverInitials: string;
	currentRating: number;
	onSubmit: (rating: number) => void;
	onClose?: () => void;
}

const RateDriverModal: React.FC<RateDriverModalProps> = ({
	driverName,
	driverAvatar,
	driverInitials,
	currentRating,
	onSubmit,
	onClose,
}) => {
	const [selectedRating, setSelectedRating] = useState<number>(0);
	const [hoveredRating, setHoveredRating] = useState<number>(0);

	const handleStarClick = (rating: number) => {
		setSelectedRating(rating);
	};

	const handleStarHover = (rating: number) => {
		setHoveredRating(rating);
	};

	const handleSubmit = () => {
		if (selectedRating > 0) {
			onSubmit(selectedRating);
		}
	};

	const displayRating = hoveredRating || selectedRating;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-[393px] p-8 space-y-6 relative">
				{/* Close button (optional) */}
				{onClose && (
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Close"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18 6L6 18M6 6L18 18"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				)}

				{/* Driver Avatar with Current Rating */}
				<div className="flex flex-col items-center space-y-4">
					<div className="relative">
						{/* Avatar */}
						<div className="w-32 h-32 bg-[#0E4663] rounded-full flex items-center justify-center text-white font-bold text-5xl overflow-hidden">
							{driverAvatar ? (
								<Image
									src={driverAvatar}
									alt={driverName}
									width={128}
									height={128}
									className="object-cover w-full h-full"
								/>
							) : (
								<span>{driverInitials}</span>
							)}
						</div>

						{/* Current Rating Badge */}
						{currentRating > 0 && (
							<div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
								<div className="bg-[#0E4663] rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg border-4 border-white">
									<span className="text-sm font-bold text-white">
										{currentRating.toFixed(1)}
									</span>
									<svg
										className="w-4 h-4 text-yellow-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</div>
							</div>
						)}
					</div>

					{/* Driver Name */}
					<h2 className="text-2xl font-bold text-[#0E4663] text-center">
						{driverName}
					</h2>
				</div>

				{/* Rate your experience text */}
				<div className="text-center">
					<h3 className="text-xl font-semibold text-[#0E4663]">
						Rate your experience
					</h3>
				</div>

				{/* Star Rating */}
				<div className="flex justify-center items-center space-x-2">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							onClick={() => handleStarClick(star)}
							onMouseEnter={() => handleStarHover(star)}
							onMouseLeave={() => setHoveredRating(0)}
							className="transition-transform hover:scale-110 focus:outline-none"
							aria-label={`Rate ${star} stars`}
						>
							<svg
								width="56"
								height="56"
								viewBox="0 0 56 56"
								fill={star <= displayRating ? "#FFD700" : "none"}
								stroke={star <= displayRating ? "#FFD700" : "#E5E7EB"}
								strokeWidth="2"
								xmlns="http://www.w3.org/2000/svg"
								className="transition-colors duration-150"
							>
								<path
									d="M28 4L34.472 20.528L52 24L40 36.472L43.056 54L28 46.528L12.944 54L16 36.472L4 24L21.528 20.528L28 4Z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					))}
				</div>

				{/* Done Button */}
				<button
					onClick={handleSubmit}
					disabled={selectedRating === 0}
					className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
						selectedRating > 0
							? "bg-[#0E4663] text-white hover:bg-[#0A3A50] shadow-md"
							: "bg-gray-200 text-gray-400 cursor-not-allowed"
					}`}
				>
					done
				</button>
			</div>
		</div>
	);
};

export default RateDriverModal;
