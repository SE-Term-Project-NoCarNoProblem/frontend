"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ChooseRideCardProps {
  rideType?: string;
  capacity?: string;
  price?: number;
  currency?: string;
  onBack?: () => void;
  onRequestRide?: () => void;
  showBackButton?: boolean;
}

const ChooseRideCard = ({
  rideType = "Car ride",
  capacity = "3 people",
  price = 120,
  currency = "Baht",
  onBack,
  onRequestRide,
  showBackButton = true,
}: ChooseRideCardProps) => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleRequestRide = () => {
    if (onRequestRide) {
      onRequestRide();
    } else {
      router.push("/ride-request");
    }
  };

  return (
    <div className="w-full max-w-[393px] h-[215px] bg-white rounded-3xl shadow-lg p-4 flex flex-col">
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

      {/* Ride Option Box */}
      <div 
        onClick={() => setIsSelected(!isSelected)}
        className={`mb-3 border-2 rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer ${
          isSelected 
            ? 'border-[#0E4663] bg-[#E8F1F5]' 
            : 'border-gray-300 hover:border-[#0E4663]'
        }`}
      >
        {/* Car Icon and Details */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/car.svg"
              alt="Car"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0E4663]">
              {rideType}
            </h3>
            <p className="text-sm text-gray-600">{capacity}</p>
          </div>
        </div>

        {/* Price and Scissors Icon */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-lg font-bold text-[#0E4663]">
              {price} {currency}
            </p>
            <p className="text-xs text-gray-500">after tax</p>
          </div>
        </div>
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
