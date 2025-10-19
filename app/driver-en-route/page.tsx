'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import DriverInfoCard from '@/app/components/DriverInfoCard'
import { fetchWithAuth } from '../lib/api'

// Mock driver data - in a real app this would come from an API
const mockDriverData = {
  name: "Sippakorn Thunyahan",
  vehicle: "Honda Civic (Black)",
  plateNumber: "กก 1234",
  rating: 4.8,
  avatar: "ST", // Using initials as placeholder
  status: "on the way",
  estimatedArrival: "5 mins",
  phone: "+66123456789"
}

interface DriverLocations {
  [driverId: string]: [number, number];
}

async function fetchDriverLocation(): Promise<[number, number]> {
  await new Promise(resolve => setTimeout(resolve, 500))

  const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/location`)

  if (!res.ok) {
    throw new Error(`Failed to fetch driver location: ${res.status}`);
  }

  const data: DriverLocations = await res.json();

  const driver = Object.values(data)[0];
  if (!driver) {
    throw new Error("No drivers available");
  }

  return driver;
}

export default function DriverEnRoutePage() {
  const [driverLocation, setDriverLocation] = useState<[number, number]>([13.7563, 100.5018]) // Default to Bangkok
  const [pickupLocation, setPickupLocation] = useState<[number, number]>([13.7563, 100.5018])
  const [destinationLocation, setDestinationLocation] = useState<[number, number]>([13.7463, 100.5118])

  // Dynamic import for the map component to avoid SSR issues
  const DriverEnRouteMap = useMemo(() => dynamic(
    () => import('@/app/components/DriverEnRouteMap'),
    {
      loading: () => <div className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>,
      ssr: false
    }
  ), [])

  // Simulate backend updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const newLocation = await fetchDriverLocation()
      setDriverLocation(newLocation)
      console.log("Driver location:", newLocation)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleMessageDriver = () => {
    // Redirect to current page (refresh)
    window.location.reload()
  }

  const handleCancel = () => {
    // In a real app, this would cancel the ride
    if (confirm('Are you sure you want to cancel this ride?')) {
      // Redirect to ride-request page
      window.location.href = '/ride-request'
    }
  }

  const handleCall = () => {
    // In a real app, this would initiate a call
    window.location.href = `tel:${mockDriverData.phone}`
  }

  const handleRecenterOnDriver = () => {
    setDriverLocation(prev => [...prev]) // Trigger re-center
  }

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
      <DriverInfoCard
        driver={mockDriverData}
        onMessageDriver={handleMessageDriver}
        onCancel={handleCancel}
        onBack={() => window.history.back()}
        showActions={true}
        showStatus={true}
        showBackButton={true}
      />
    </div>
  )
}