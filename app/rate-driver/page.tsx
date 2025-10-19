"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

interface Driver {
  id: string;
  name: string;
  car: string;
  plate: string;
  rating: number | null;
  avatarUrl: string;
}

export default function RideRequest() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/MapDriver"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const [driverPosition, setDriverPosition] = useState<[number, number] | null>(
    null
  );

  const [driver, setDriver] = useState<Driver | null>(null);
  const [rating, setRating] = useState<number>(0);

  const handleClick = (value: number): void => {
    setRating(value);
    console.log("User rating:", value); // You can send this to backend later
  };
  // Fetch ride request (mock ride id for now)
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/nearby`
        );
        const data = await res.json();
        setDriver(data.driver); // store driver info
        console.log(data.driver);
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
      {driverPosition && <Map position={driverPosition} />}

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 w-full z-400 bg-white p-4 shadow-lg rounded-2xl text-[#0E4663]">
        <Image
          src="/arrow_back.svg"
          alt="arrow"
          width={20}
          height={20}
          className="rounded-full"
        />

        {driver ? (
          <div className="flex flex-col items-center">
            <div className="relative flex rounded-full bg-white w-34 h-32 items-center justify-center my-5">
              <Image
                alt="Profile Picture"
                src={`./ST-rate-driver.svg`}
                width={120}
                height={120}
                className="rounded-full"
              />
              <div className="absolute border-2 border-white bottom-[-10px] bg-[#0E4663] rounded-full px-2 text-sm text-[#F8F8F8]">
                <>
                  {/* <span>{driver.rating}</span> */}
                  <span>4.8</span>
                  <span className="text-yellow-400">★</span>
                </>
              </div>
            </div>
            {/* <div className="">{driver.name}</div> */}
            <div className="text-[#909090] text-sm">Sippakorn Thunyahan</div>
            <div className="font-bold">Rate your experience</div>
            {/* <div className="text-4xl text-yellow-400">★★★★★</div> */}
            <div className="text-4xl flex gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star: number) => (
                <span
                  key={star}
                  onClick={() => handleClick(star)}
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-400"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <div className="mt-2 text-sm">
              {rating > 0 ? `You rated: ${rating} star(s)` : "No rating yet"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative flex rounded-full bg-white w-34 h-32 items-center justify-center my-5">
              <Image
                alt="Profile Picture"
                src={`./ST-rate-driver.svg`}
                width={120}
                height={120}
                className="rounded-full"
              />
              <div className="absolute border-2 border-white bottom-[-10px] bg-[#0E4663] rounded-full px-2 text-sm text-[#F8F8F8]">
                <>
                  {/* <span>{driver.rating}</span> */}
                  <span>4.8</span>
                  <span className="text-yellow-400">★</span>
                </>
              </div>
            </div>
            {/* <div className="">{driver.name}</div> */}
            <div className="text-[#909090] text-sm">Sippakorn Thunyahan</div>
            <div className="font-bold">Rate your experience</div>
            {/* <div className="text-4xl text-yellow-400">★★★★★</div> */}
            <div className="text-4xl flex gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star: number) => (
                <span
                  key={star}
                  onClick={() => handleClick(star)}
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-400"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <div className="mt-2 text-sm">
              {rating > 0 ? `You rated: ${rating} star(s)` : "No rating yet"}
            </div>
            <Link
              href="/"
              className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer shadow-xl"
            >
              <div className="flex px-20 py-2">
                <p className="flex items-center text-[#F8F8F8]"> Done </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
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
