'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BottomSheet from "../components/BottomSheet";
import { MapHandle } from "@/app/components/Map";

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [position, setPosition] = useState<[number, number]>([13.7563, 100.5018]);
  useEffect(() => {
        getUserLocation().then(setPosition).catch(()=>{console.error; setPosition([13.7563, 100.5018])});
  }, []);
  
  const mapRef = useRef<MapHandle>(null);
  const handleRequestRide = () => {
    mapRef.current?.requestRide();
  };

  return <div>
    <Map position={position} ref={mapRef}/>
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