"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import DriverInfoCard from "@/app/components/DriverInfoCard";
import DriverStatusCard from "../components/DriverStatusCard";

// Mock driver data - in a real app this would come from an API
const mockDriverData = {
  name: "Sippakorn Thunyahan",
  vehicle: "Honda Civic (Black)",
  plateNumber: "กก 1234",
  rating: 4.8,
  avatar: "ST", // Using initials as placeholder
  status: "on the way",
  estimatedArrival: "5 mins",
  phone: "+66123456789",
};

export default function DriverEnRoutePage() {
  const [driverLocation, setDriverLocation] = useState<[number, number]>([
    13.7563, 100.5018,
  ]); // Default to Bangkok
  const [pickupLocation, setPickupLocation] = useState<[number, number]>([
    13.7563, 100.5018,
  ]);
  const [destinationLocation, setDestinationLocation] = useState<
    [number, number]
  >([13.7463, 100.5118]);
  const [isAccepted, setIsAccepted] = useState<boolean>(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Dynamic import for the map component to avoid SSR issues
  const DriverEnRouteMap = useMemo(
    () =>
      dynamic(() => import("@/app/components/DriverEnRouteMap"), {
        loading: () => (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Loading map...</p>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  // Simulate driver movement (in a real app, this would come from real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => [
        prev[0] + (Math.random() - 0.5) * 0.001,
        prev[1] + (Math.random() - 0.5) * 0.001,
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMessageDriver = () => {
    // Redirect to current page (refresh)
    window.location.reload();
  };

  const handleCancel = () => {
    // In a real app, this would cancel the ride
    // if (confirm("Are you sure you want to cancel this ride?")) {
    //   // Redirect to ride-request page
    //   window.location.href = "/ride-request";
    // }
    setShowCancelConfirm(true);
  };

const handleConfirmCancel = async () => {
  try {
    const rideId = "1115ad62-343f-4997-bfb2-a945d522a34f" // mock
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rides/cancel/${rideId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use JWT auth
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to cancel ride");
    }

    const data = await res.json();
    console.log("Ride canceled:", data);

    // Optional: redirect or update UI
    window.location.href = "/ride-request"; 
  } catch (error) {
    console.error(error);
    alert("Something went wrong while canceling the ride.");
  }
};


  const handleCall = () => {
    // In a real app, this would initiate a call
    window.location.href = `tel:${mockDriverData.phone}`;
  };

  const handleRecenterOnDriver = () => {
    setDriverLocation((prev) => [...prev]); // Trigger re-center
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Map Container */}
      <DriverEnRouteMap
        driverLocation={driverLocation}
        pickupLocation={pickupLocation}
        destinationLocation={destinationLocation}
        driverName={mockDriverData.name}
        onRecenterDriver={handleRecenterOnDriver}
        driverStatus={mockDriverData.status}
      />

      {/* Driver Info Card */}

      <div className="flex flex-col items-center">
        {!showCancelConfirm && (
          <DriverStatusCard
            driver={mockDriverData}
            isAccepted={isAccepted}
            showBackButton={false}
            showStatus={true}
            showActions={true}
            onMessageDriver={handleMessageDriver}
            onCancel={handleCancel}
          />
        )}
      </div>

      {showCancelConfirm && (
        <div className="flex flex-col items-center absolute bottom-0 left-0 w-full z-400 bg-white p-4 shadow-lg rounded-2xl text-[#0E4663]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-100 flex flex-col items-center">
            <p className="text-[#A74242] font-bold text-2xl">
              Confirm cancellation
            </p>
            <p className="text-[#909090] text-sm my-4">
            Are you sure you want to cancel a ride? You won’t be charged a
            cancellation fee,
            </p>

            <div className="flex justify-between w-full">
              <button
                onClick={() => {
                  setShowCancelConfirm(false)
                  handleConfirmCancel();
                  console.log("Ride canceled");
                }}
                className="px-10 py-2 bg-[#A74242] rounded hover:bg-[#A74242]/90 hover:cursor-pointer text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                }}
                className="px-10 py-2 bg-[#969696] rounded hover:bg-[#969696]/90 hover:cursor-pointer text-white font-bold"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
