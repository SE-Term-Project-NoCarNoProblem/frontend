'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BottomSheet from "../components/BottomSheet";
import { MapHandle } from "@/app/components/Map";
import { io } from 'socket.io-client';
import { fetchWithAuth } from "../lib/api";
import ChooseRideCard from "../components/ChooseRideCard";

interface Driver {
  driver_id: string;
  lat: number;
  lng: number;
  distance_m: number;
}

type UserMode = 'customer' | 'driver';

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [userMode, setUserMode] = useState<UserMode>('customer');
  const [drivers, setDrivers] = useState<[number, number][]>([]);

  // Location state
  const [srcMarker, setSrcMarker] = useState<[number, number]>();
  const [srcAddress, setSrcAddress] = useState<string>("");
  const [srcQuery, setSrcQuery] = useState("");
  const [destMarker, setDestMarker] = useState<[number, number] | null>(null);
  const [destAddress, setDestAddress] = useState<string>("");
  const [destQuery, setDestQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesTarget, setFavoritesTarget] = useState<"src" | "dest" | null>(null);

  // Update addresses when markers change
  useEffect(() => {
    if (srcMarker) {
      reverseGeocode(srcMarker[0], srcMarker[1]).then((display_name) => {
        setSrcAddress(display_name);
        setSrcQuery(display_name);
      });
    }
  }, [srcMarker]);

  useEffect(() => {
    if (destMarker) {
      reverseGeocode(destMarker[0], destMarker[1]).then((display_name) => {
        setDestAddress(display_name);
        setDestQuery(display_name);
      });
    }
  }, [destMarker]);

  /* ### Reverse geocoding ### */
  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name;
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return "Address not found";
    }
  }

  /* ### Forward geocoding / Search ### */
  async function handleSearch(type: "src" | "dest", query: string) {
    if (!query) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];

        if (type === "src") {
          setSrcMarker(coords);
          setSrcAddress(display_name);
        } else if (type === "dest") {
          setDestMarker(coords);
          setDestAddress(display_name);
        }
      } else {
        if (type === "src") {
          setSrcAddress("Location not found");
        } else if (type === "dest") {
          setDestAddress("Location not found");
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      if (type === "src") {
        setSrcAddress("Error searching location");
      } else if (type === "dest") {
        setDestAddress("Error searching location");
      }
    }
  }

  useEffect(() => {
    // Create socket immediately so we can clean it up synchronously in the effect cleanup
    const socket = io(new URL(process.env.NEXT_PUBLIC_BACKEND_URL!).origin.replaceAll('http', 'ws'), {
      path: '/socket.io/',
      auth: {
        token: localStorage.getItem('token') || '',
      }
    });

    let watchId: number | null = null;

    // Async init logic
    (async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`);
        if (!res.ok) {
          throw new Error('Failed to fetch profile, invalid token');
        }
        const user = await res.json();

        socket.on('position:driver_positions', (data: Driver[]) => {
          console.log('Received driver positions:', data);
          setDrivers(data.map((d) => [d.lat, d.lng]));
        });

        console.log(user.data);

        if (!('geolocation' in navigator)) {
          console.log('Geolocation is not supported by this browser.');
        }

        const sendPosition = async (lat: number, lng: number) => {
          console.log('sending position to server:', lat, lng);
          socket.emit('position:submit_driver_position', {
            user_id: user.data.id,
            position: [lat, lng],
          });
        };

        // Only send initial position if in driver mode
        if (userMode === 'driver') {
          try {
            console.log('Getting initial driver location...');
            const d = await getUserLocation();
            await sendPosition(d[0], d[1]);
          } catch (e) {
            console.error('Failed to get initial location', e);
          }
        }

        // Only watch position if in driver mode
        if (userMode === 'driver') {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              console.log('Latitude:', position.coords.latitude);
              console.log('Longitude:', position.coords.longitude);
              console.log('Accuracy:', position.coords.accuracy, 'meters');
              sendPosition(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
              console.error('Error getting location:', error);
            },
            {
              enableHighAccuracy: true,
              // maximumAge: 0,
              // timeout: 1000,
            }
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();

    // Cleanup runs synchronously when userMode changes or component unmounts
    return () => {
      console.log('Cleaning up location watchers and socket...');
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      try {
        socket.disconnect();
      } catch (e) {
        console.error('Error disconnecting socket', e);
      }
    };
    }, [userMode]); // Re-run when userMode changes

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as UserMode;
    setUserMode(newMode);
    };

    const [fare, setFare] = useState<number | null>(null);

    useEffect(() => {
    if (srcMarker && destMarker) {
      setFare(null);
      
      const fetchFare = async () => {
      try {
        const params = new URLSearchParams({
        pickup_lat: srcMarker[0].toString(),
        pickup_lng: srcMarker[1].toString(),
        dropoff_lat: destMarker[0].toString(),
        dropoff_lng: destMarker[1].toString(),
        });
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/requests/fare?${params}`);
        if (!res.ok) {
        throw new Error('Failed to fetch fare');
        }
        const data = await res.json();
        setFare(Math.round(data.fare_baht * 1.07));
      } catch (err) {
        console.error('Error fetching fare:', err);
      }
      };
      
      fetchFare();
    }
    }, [srcMarker, destMarker]);

    const mapRef = useRef<MapHandle>(null);
    const handleRequestRide = () => {
    mapRef.current?.requestRide();
    };

    return <div>
    <Map 
      ref={mapRef} 
      drivers={drivers} 
      userMode={userMode} 
      onModeChange={handleModeChange}
      srcMarker={srcMarker}
      srcAddress={srcAddress}
      destMarker={destMarker}
      destAddress={destAddress}
      srcQuery={srcQuery}
      destQuery={destQuery}
      onSrcQueryChange={setSrcQuery}
      onDestQueryChange={setDestQuery}
      onSrcSearch={() => handleSearch("src", srcQuery)}
      onDestSearch={() => handleSearch("dest", destQuery)}
      onSrcMarkerSet={setSrcMarker}
      onDestMarkerSet={setDestMarker}
      showFavorites={showFavorites}
      favoritesTarget={favoritesTarget}
      onShowFavoritesChange={setShowFavorites}
      onFavoritesTargetChange={setFavoritesTarget}
    />
    {/* <BottomSheet onRequestRide={handleRequestRide}/> */}
    <div className="absolute bottom-0 left-0 right-0 w-full z-10">
			{ userMode == "customer" && srcAddress && destAddress && fare && <ChooseRideCard price={fare} /> }
      {/* <p className="text-amber-900">ok</p> */}
    </div>
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