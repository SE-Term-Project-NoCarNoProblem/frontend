'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BottomSheet from "../components/BottomSheet";
import { MapHandle } from "@/app/components/Map";

interface Driver {
  driver_id: string;
  lat: number;
  lng: number;
  distance_m: number;
}

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [position, setPosition] = useState<[number, number]>([13.7563, 100.5018]);
  const [drivers, setDrivers] = useState<[number, number][]>([
    [13.7420, 100.5470], // Random
    [13.7300, 100.5800], // Random
    [13.7650, 100.5200]  // Random
  ]);

  useEffect(() => {
        getUserLocation().then(setPosition).catch(()=>{console.error; setPosition([13.7563, 100.5018])});

        const fetchRide = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/nearby`);
          const data = await res.json();
          setDrivers(data.map((d: Driver) => [d.lat, d.lng])); // store driver info
        } catch (err) {
          console.error("Failed to fetch ride:", err);
        }
      };
      fetchRide();
  }, []);
  
  const mapRef = useRef<MapHandle>(null);
  const handleRequestRide = () => {
    mapRef.current?.requestRide();
  };

  return <div>
    <Map position={position} ref={mapRef} drivers={drivers}/>
    <BottomSheet onRequestRide={handleRequestRide}/>
  </div>
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