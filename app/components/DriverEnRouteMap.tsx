'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { RecenterMap } from '@/app/hooks/RecenterMap'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface DriverEnRouteMapProps {
  driverLocation: [number, number]
  pickupLocation: [number, number]
  destinationLocation: [number, number]
  driverName: string
  onRecenterDriver: () => void
  driverStatus: string
}

export default function DriverEnRouteMap({
  driverLocation,
  pickupLocation,
  destinationLocation,
  driverName,
  onRecenterDriver,
  driverStatus
}: DriverEnRouteMapProps) {
  return (
    <div className="flex-1 relative">
      <MapContainer 
        center={driverLocation} 
        zoom={15} 
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Driver Marker */}
        <Marker position={driverLocation}>
          <Popup>
            <div className="text-center">
              <strong>{driverName}</strong><br />
              Driver Location
            </div>
          </Popup>
        </Marker>

        {/* Pickup Marker */}
        <Marker position={pickupLocation}>
          <Popup>
            <div className="text-center">
              <strong>Pickup Location</strong><br />
              Athletic Field
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={destinationLocation}>
          <Popup>
            <div className="text-center">
              <strong>Destination</strong><br />
              Your destination
            </div>
          </Popup>
        </Marker>

        <RecenterMap position={driverLocation} />
      </MapContainer>

      {/* Status Badge */}
      <div className="absolute top-8 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg z-10">
        🚗 Driver is {driverStatus}
      </div>

      {/* Recenter Button */}
      <button
        onClick={onRecenterDriver}
        className="absolute top-8 left-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
        title="Center on driver"
      >
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Zoom Controls */}
      <div className="absolute bottom-32 right-4 bg-white shadow-lg rounded-lg p-1 z-10 flex flex-col">
        <button 
          className="p-2 hover:bg-gray-50 transition-colors border-b border-gray-200"
          title="Zoom in"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button 
          className="p-2 hover:bg-gray-50 transition-colors"
          title="Zoom out"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}