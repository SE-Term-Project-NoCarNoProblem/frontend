'use client'

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

interface Driver {
  id: string;
  name: string;
  car: string;
  plate: string;
  rating: number;
  avatarUrl: string;
}

export default function RideRequest() {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/MapDriver'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [driverPosition, setDriverPosition] = useState<[number, number] | null>(null);
  // Mock users/passengers
  const [users, setUsers] = useState<[number, number][]>([
    [13.7420, 100.5470], // Random
    [13.7300, 100.5800], // Random
    [13.7650, 100.5200]  // Random
  ]);

  const [driver, setDriver] = useState<Driver | null>(null);
    // Fetch ride request (mock ride id for now)
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/nearby`);
        const data = await res.json();
        setDriver(data.driver); // store driver info
      } catch (err) {
        console.error("Failed to fetch ride:", err);
      }
    };
    fetchRide();
  }, []);

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const position = await getDriverLocation();

      // Send to backend
      // console.log(position);
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: position[0], lng: position[1] }),
      });
      setDriverPosition(position);
    } catch (err) {
      console.error(err);
    }
  }, 5000); // every 5 seconds

  return () => clearInterval(interval);
}, []);
  
  return (
  <div className="relative w-full h-screen">
    {driverPosition && (
      <Map position={driverPosition} drivers={users}/>
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
                    {/* {driver.name} */}
                    Sippakorn Thunyahan 
                </div>
                <div className="text-sm">
                    {/* {driver.car} : {driver.plate} */}
                    Honda civic (Black) : กข 1234 
                </div>      
            </div>
            <div>
                <Image src="/Avatar.svg" alt="Avatar" width={50} height={50} className="rounded-full"/>
                <Image src="/rating.svg" alt="rating" width={50} height={50} className="rounded-full"/>    
                {/* <div className="text-sm text-center">{driver.rating}  ⭐</div> */}
            </div>
        </div>
    </div>
  </div>
  )
}

function getDriverLocation(): Promise<[number, number]> {
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
