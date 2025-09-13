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

  const [position, setPosition] = useState<[number, number] | null>(null);
  useEffect(() => {
        getUserLocation().then(setPosition).catch(console.error);
  }, []);
  
  return (
  <div className="relative w-full h-screen">
      {/* Map fills the parent */}
    <Map position={position}/>

    {/* Bottom panel (always sticks to bottom of viewport) */}
    <div className="absolute bottom-0 left-0 w-full z-400 bg-white p-4 shadow-lg rounded-2xl text-[#0E4663]">
        <Image
            src="/arrow_back.svg"
            alt="arrow"
            width={20}
            height={20}
            className="rounded-full"
        />
        
        <div className="flex w-[100%] justify-between mx-2 items-center px-4">
            <div className=""> 
                <div className="font-semibold">
                    Sippakorn Thunyahan 
                </div>
                <div className="text-sm">
                    Honda civic (Black) : กข 1234 
                </div>      
            </div>
            <div className="">
                <Image
                    src="/Avatar.svg"
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                />     
                <Image
                    src="/rating.svg"
                    alt="rating"
                    width={50}
                    height={50}
                    className="rounded-full"
                />    
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