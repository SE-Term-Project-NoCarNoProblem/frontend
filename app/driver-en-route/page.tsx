'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import DriverInfoCard from '@/app/components/DriverInfoCard'

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

  // Simulate driver movement (in a real app, this would come from real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => [
        prev[0] + (Math.random() - 0.5) * 0.001,
        prev[1] + (Math.random() - 0.5) * 0.001
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleMessageDriver = () => {
    // In a real app, this would open a messaging interface
    alert('Opening message interface...')
  }

  const handleCancel = () => {
    // In a real app, this would cancel the ride
    if (confirm('Are you sure you want to cancel this ride?')) {
      alert('Ride cancelled')
      // Navigate back or to home page
      window.history.back()
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