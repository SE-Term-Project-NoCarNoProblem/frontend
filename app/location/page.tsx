'use client'
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

export default function Home() {
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
  
  return <div>
    <Map position={position}/>
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