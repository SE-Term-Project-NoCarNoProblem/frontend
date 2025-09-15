'use client'

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function RideRequest() {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [drivers, setDrivers] = useState<[number, number][]>([]);

  useEffect(() => {
    getUserLocation().then(setUserPosition).catch(console.error);

    // Example: fetch drivers location (replace with real API later)
    setDrivers([
      [13.7563, 100.5018], // Bangkok
      [13.7420, 100.5470], // Random
      [13.7300, 100.5800]  // Random
    ]);
  }, []);
  
  return (
  <div className="relative w-full h-screen">
    {userPosition && (
      <Map position={userPosition} drivers={drivers}/>
    )}

    {/* Bottom panel */}
    <div className="absolute bottom-0 left-0 w-full z-400 bg-white p-4 shadow-lg rounded-2xl text-[#0E4663]">
        <Image
            src="/arrow_back.svg"
            alt="arrow"
            width={20}
            height={20}
            className="rounded-full"
        />
        
        <div className="flex w-[100%] justify-between mx-2 items-center px-4">
            <div> 
                <div className="font-semibold">
                    Sippakorn Thunyahan 
                </div>
                <div className="text-sm">
                    Honda civic (Black) : กข 1234 
                </div>      
            </div>
            <div>
                <Image src="/Avatar.svg" alt="Avatar" width={50} height={50} className="rounded-full"/>
                <Image src="/rating.svg" alt="rating" width={50} height={50} className="rounded-full"/>    
            </div>
        </div>
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
