"use client";

import React from "react";
import Image from "next/image";

interface DriverActionCardProps {
	customer?: {
		name: string;
		pickupAddress: string;
		dropoffAddress: string;
		avatar: string;
		avatarImage?: string;
	};
	rideStatus: "on_the_way" | "arrived" | "picked_up" | "completed";
	onStatusUpdate: (newStatus: "arrived" | "picked_up" | "completed") => void;
	onCancel: () => void;
	onMessageCustomer?: () => void;
}

const DriverActionCard = ({
	customer = {
		name: "Customer",
		pickupAddress: "Pickup location",
		dropoffAddress: "Dropoff location",
		avatar: "C",
	},
	rideStatus,
	onStatusUpdate,
	onCancel,
	onMessageCustomer,
}: DriverActionCardProps) => {
	// Determine which button to show based on current status
	const getActionButton = () => {
		switch (rideStatus) {
			case "on_the_way":
				return (
					<button
						onClick={() => onStatusUpdate("arrived")}
						className="flex-[2] bg-[#0E4663] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#0A3A50] transition-colors"
					>
						Arrived at pickup
					</button>
				);
			case "arrived":
				return (
					<button
						onClick={() => onStatusUpdate("picked_up")}
						className="flex-[2] bg-[#0E4663] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#0A3A50] transition-colors"
					>
						Picked up passenger
					</button>
				);
			case "picked_up":
				return (
					<button
						onClick={() => onStatusUpdate("completed")}
						className="flex-[2] bg-green-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
					>
						Complete ride
					</button>
				);
			case "completed":
				return null;
		}
	};

	// Determine which steps are completed based on status
	const isStatusCompleted = (step: string) => {
		const statusOrder = ["on_the_way", "arrived", "picked_up", "completed"];
		const currentIndex = statusOrder.indexOf(rideStatus);
		const stepIndex = statusOrder.indexOf(step);
		return currentIndex >= stepIndex;
	};

	return (
		<div className="w-full mx-auto max-w-[393px] bg-white shadow-lg rounded-t-3xl p-6 space-y-3 flex flex-col">
			{/* Upper Bar */}
			<div className="flex justify-center">
				<Image src="/upper bar.svg" alt="Upper bar" width={148} height={4} />
			</div>

			{/* Customer Info Row */}
			<div className="flex items-start justify-between">
				{/* Customer Details */}
				<div className="flex-1">
					<h3 className="font-bold text-[#0E4663] text-lg mb-1">
						{customer.name}
					</h3>
					<p className="text-sm text-[#0E4663] mb-1">
						<span className="font-semibold">Pickup:</span>{" "}
						{customer.pickupAddress.length > 40
							? customer.pickupAddress.substring(0, 40) + "..."
							: customer.pickupAddress}
					</p>
					<p className="text-sm text-[#0E4663]">
						<span className="font-semibold">Dropoff:</span>{" "}
						{customer.dropoffAddress.length > 40
							? customer.dropoffAddress.substring(0, 40) + "..."
							: customer.dropoffAddress}
					</p>
				</div>

				{/* Avatar */}
				<div className="relative flex-shrink-0">
					<div className="w-16 h-16 bg-[#0E4663] rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
						{customer.avatarImage ? (
							<Image
								src={customer.avatarImage}
								alt={customer.name}
								width={64}
								height={64}
								className="object-cover w-full h-full"
							/>
						) : (
							<span>{customer.avatar}</span>
						)}
					</div>
				</div>
			</div>

			{/* Status Progress Bar */}
			<div className="py-4 flex-1 flex items-center">
				<div className="flex items-center justify-between w-full px-2">
					{/* On the way */}
					<div className="flex flex-col items-center">
						<div
							className={`w-4 h-4 rounded-full mb-2 ${
								isStatusCompleted("on_the_way")
									? "bg-[#0E4663]"
									: "bg-white border-2 border-[#0E4663]"
							}`}
						></div>
						<span
							className={`text-xs ${
								isStatusCompleted("on_the_way")
									? "text-[#0E4663] font-medium"
									: "text-[#0E4663]"
							}`}
						>
							on the way
						</span>
					</div>

					{/* Line */}
					<div
						className={`flex-1 h-0.5 mx-2 ${
							isStatusCompleted("arrived") ? "bg-[#0E4663]" : "bg-gray-300"
						}`}
					></div>

					{/* Arrived */}
					<div className="flex flex-col items-center">
						<div
							className={`w-4 h-4 rounded-full mb-2 ${
								isStatusCompleted("arrived")
									? "bg-[#0E4663]"
									: "bg-white border-2 border-[#0E4663]"
							}`}
						></div>
						<span
							className={`text-xs ${
								isStatusCompleted("arrived")
									? "text-[#0E4663] font-medium"
									: "text-[#0E4663]"
							}`}
						>
							arrived
						</span>
					</div>

					{/* Line */}
					<div
						className={`flex-1 h-0.5 mx-2 ${
							isStatusCompleted("picked_up") ? "bg-[#0E4663]" : "bg-gray-300"
						}`}
					></div>

					{/* Picked up */}
					<div className="flex flex-col items-center">
						<div
							className={`w-4 h-4 rounded-full mb-2 ${
								isStatusCompleted("picked_up")
									? "bg-[#0E4663]"
									: "bg-white border-2 border-[#0E4663]"
							}`}
						></div>
						<span
							className={`text-xs ${
								isStatusCompleted("picked_up")
									? "text-[#0E4663] font-medium"
									: "text-[#0E4663]"
							}`}
						>
							picked up
						</span>
					</div>

					{/* Line */}
					<div
						className={`flex-1 h-0.5 mx-2 ${
							isStatusCompleted("completed") ? "bg-[#0E4663]" : "bg-gray-300"
						}`}
					></div>

					{/* Completed */}
					<div className="flex flex-col items-center">
						<div
							className={`w-4 h-4 rounded-full mb-2 ${
								isStatusCompleted("completed")
									? "bg-[#0E4663]"
									: "bg-white border-2 border-[#0E4663]"
							}`}
						></div>
						<span
							className={`text-xs ${
								isStatusCompleted("completed")
									? "text-[#0E4663] font-medium"
									: "text-[#0E4663]"
							}`}
						>
							drop off
						</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			{rideStatus !== "completed" && (
				<div className="flex gap-3 mt-auto">
					<button
						onClick={onCancel}
						className="flex-1 bg-[#A74242] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#8E3636] transition-colors"
					>
						Cancel
					</button>

					{getActionButton()}

					{onMessageCustomer && (
						<button
							onClick={onMessageCustomer}
							className="flex-1 bg-gray-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
						>
							Message
						</button>
					)}
				</div>
			)}

			{rideStatus === "completed" && (
				<div className="text-center py-4">
					<p className="text-lg font-semibold text-green-600">
						Ride Completed! 🎉
					</p>
				</div>
			)}
		</div>
	);
};

export default DriverActionCard;
