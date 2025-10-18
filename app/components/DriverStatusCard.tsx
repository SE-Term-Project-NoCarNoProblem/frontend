"use client";

import React from "react";
import Image from "next/image";

interface DriverStatusCardProps {
  driver?: {
    name: string;
    vehicle: string;
    plateNumber: string;
    rating: number;
    avatar: string; // Can be initials (e.g., "ST") or image URL
    avatarImage?: string; // Optional: direct image URL/path
    status: string;
    estimatedArrival?: string;
    phone?: string;
  };
  isAccepted?: boolean;
  onMessageDriver?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
  showActions?: boolean;
  showStatus?: boolean;
  showBackButton?: boolean;
}

const DriverStatusCard = ({
  driver = {
    name: "Sippakorn Thunyahan",
    vehicle: "Honda Civic (Black)",
    plateNumber: "กก 1234",
    rating: 4.8,
    avatar: "ST",
    status: "on the way",
    estimatedArrival: "5 mins",
    phone: "+66123456789",
  },
  isAccepted = false,
  onMessageDriver,
  onCancel,
  onBack,
  showActions = true,
  showStatus = true,
  showBackButton = false,
}: DriverStatusCardProps) => {
  // Determine which steps are completed based on status
  const isStatusCompleted = (step: string) => {
    // If driver hasn't accepted yet, nothing is complete
    if (!isAccepted) return false;
    
    const statusOrder = ["accepted", "on the way", "arrived", "completed"];
    const currentIndex = statusOrder.indexOf(driver.status);
    const stepIndex = statusOrder.indexOf(step);
    return currentIndex >= stepIndex;
  };

  return (
    <div className="w-full max-w-[393px] h-[271px] bg-white shadow-lg rounded-t-3xl p-6 space-y-3 flex flex-col">
      {/* Upper Bar */}
      <div className="flex justify-center">
        <Image src="/upper bar.svg" alt="Upper bar" width={148} height={4} />
      </div>

      {/* Driver Info Row */}
      <div className="flex items-start justify-between">
        {/* Driver Details */}
        <div className="flex-1">
          <h3 className="font-bold text-[#0E4663] text-lg mb-1">
            {isAccepted ? driver.name : "Waiting for driver"}
          </h3>
          {isAccepted && (
            <p className="text-sm text-[#0E4663]">
              {driver.vehicle} : {driver.plateNumber}
            </p>
          )}
        </div>

        {/* Avatar & Rating Column - Only show when accepted */}
        {isAccepted && (
          <div className="relative flex-shrink-0">
            {/* Avatar */}
            <div className="w-16 h-16 bg-[#0E4663] rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
              {driver.avatarImage ? (
                <Image
                  src={driver.avatarImage}
                  alt={driver.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span>{driver.avatar}</span>
              )}
            </div>

            {/* Rating - Overlapping */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <div className="bg-[#0E4663] rounded-full px-2 py-0.5 flex items-center space-x-1 shadow-sm border-2 border-white">
                <span className="text-xs font-semibold text-white">
                  {driver.rating}
                </span>
                <svg
                  className="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {showStatus && (
        <div className="py-4 flex-1 flex items-center">
          {/* Horizontal timeline */}
          <div className="flex items-center justify-between w-full px-2">
            {/* Accepted */}
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${
                  isStatusCompleted("accepted")
                    ? "bg-[#0E4663]"
                    : "bg-white border-2 border-[#0E4663]"
                }`}
              ></div>
              <span
                className={`text-xs ${
                  isStatusCompleted("accepted")
                    ? "text-[#0E4663] font-medium"
                    : "text-[#0E4663]"
                }`}
              >
                accepted
              </span>
            </div>

            {/* Line */}
            <div
              className={`flex-1 h-0.5 mx-2 ${
                isStatusCompleted("on the way")
                  ? "bg-[#0E4663]"
                  : "bg-gray-300"
              }`}
            ></div>

            {/* On the way */}
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${
                  isStatusCompleted("on the way")
                    ? "bg-[#0E4663]"
                    : "bg-white border-2 border-[#0E4663]"
                }`}
              ></div>
              <span
                className={`text-xs ${
                  isStatusCompleted("on the way")
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

            {/* Pick up */}
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
                pick up
              </span>
            </div>

            {/* Line */}
            <div
              className={`flex-1 h-0.5 mx-2 ${
                isStatusCompleted("completed") ? "bg-[#0E4663]" : "bg-gray-300"
              }`}
            ></div>

            {/* Drop off */}
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
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-3 mt-auto">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#A74242] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#8E3636] transition-colors"
          >
            Cancel
          </button>

          {isAccepted && (
            <button
              onClick={onMessageDriver}
              className="flex-[2] bg-[#0E4663] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#0A3A50] transition-colors"
            >
              message a driver
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverStatusCard;
