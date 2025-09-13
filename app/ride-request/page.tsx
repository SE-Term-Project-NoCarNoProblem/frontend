'use client'

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

export default function RideRequest() {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [position, setPosition] = useState<[number, number] | null>(null);
  useEffect(() => {
        getUserLocation().then(setPosition).catch(console.error);
  }, []);
  
  return (
  <div className="relative w-full h-screen">
      {/* Map fills the parent */}
      <Map position={position}/>

  {/* Bottom panel (always sticks to bottom of viewport) */}
  <div className="absolute bottom-0 left-0 w-full z-400 bg-white p-4 shadow-lg rounded-t-2xl">
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
      Confirm Ride
    </button>
  </div>
  </div>
  )
}

function getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
                reject(error);
            }
        );
    });
}