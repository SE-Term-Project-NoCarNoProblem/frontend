'use client'
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEffect, useState } from "react"
import { RecenterMap } from "@/app/hooks/RecenterMap"
import { useGeolocation } from '@vueuse/core'


export default function Map(props: any) {
  //from location page
  const { position, zoom = 10 } = props

  const [srcMarker, setSrcMarker] = useState<[number, number]>(position);
  const [srcAddress, setSrcAddress] = useState<string>("");
  const [srcQuery, setSrcQuery] = useState("");

  const [destMarker, setDestMarker] = useState<[number, number] | null>(null);
  const [destAddress, setDestAddress] = useState<string>("");
  const [destQuery, setDestQuery] = useState("");
  //for the map to recenetr
  const [lastChanged, setLastChanged] = useState<"src" | "dest" | null>(null);
  //for map clicked
  const [lastFocused, setLastFocused] = useState<"src" | "dest" | null>(null);
  //vueuse location permission
  const { coords, locatedAt, error, resume, pause } = useGeolocation()

  /* ### Get source/pickup location and update ### */
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setSrcMarker([latitude, longitude]);
          setLastChanged("src");
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  /* ### Translate coord to address(reverse) ### */
  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name;
  }
  //src
  useEffect(() => {
    if (!srcMarker) return;

    const [lat, lng] = srcMarker;
    reverseGeocode(lat, lng).then((display_name) => {
      setSrcAddress(display_name);
      setSrcQuery(display_name);
    });
  }, [srcMarker]);
  //dest
  useEffect(() => {
    if (destMarker) {
      const [lat, lng] = destMarker;
      reverseGeocode(lat, lng).then((display_name) => {
        setDestAddress(display_name);
        setDestQuery(display_name);
      });
    }
  }, [destMarker]);

  function OnMapClicked({type} : {type:string}) {
    useMapEvents({
      click: (e)=>{
        console.log(e)
        const { lat, lng } = e.latlng;
        if (type === "src") {
          setSrcMarker([lat, lng])
          setLastChanged("src");
        } else if (type === "dest") {
          setDestMarker([lat, lng])
          setLastChanged("dest");
        }
      }
    })
    return null;
  }

  /* ### Translate address to coord(forward) ### */
  async function handleSearch(e: React.FormEvent, type: "src" | "dest",  query: string) {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
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
        setLastChanged(type);
      } else {
        if (type === "src") {
          setSrcAddress("Location not found");
        } else if (type === "dest") {
          setDestAddress("Location not found");
        }
      }
    } catch (err) {
      if (type === "src") {
        setSrcAddress("Error searching location");
      } else if (type === "dest") {
        setDestAddress("Error searching location");
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row w-full">
        <form onSubmit={(e) => handleSearch(e, "src", srcQuery)} 
        className="flex-1 p-2 flex gap-2 bg-slate-300 border border-red-500 border-1 hover:border-3"
        onFocus={()=>{setLastFocused("src")}}
        >
          <div className="text-emerald-600 text-xl my-auto">Pickup</div>
          <input
            type="text"
            value={srcQuery}
            placeholder="Enter a place"
            onChange={(e) => setSrcQuery(e.target.value)}
            className="flex-1 p-2 border rounded-xl text-black placeholder-slate-600 focus:outline-none 
            focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-indigo-500 
          hover:shadow-lg hover:-translate-y-1 hover:scale-110">
            Search
          </button>
        </form>
        <form onSubmit={(e) => handleSearch(e, "dest", destQuery)} 
        className="flex-1 p-2 flex gap-2 bg-slate-300 border border-red-500 border hover:border-3"
        onFocus={()=>{setLastFocused("dest")}}
        >
          <div className="text-emerald-600 text-xl my-auto">Destination</div>
          <input
            type="text"
            value={destQuery}
            placeholder="Enter a place"
            onChange={(e) => setDestQuery(e.target.value)}
            className="flex-1 p-2 border rounded-xl text-black placeholder-slate-600 focus:outline-none 
            focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-indigo-500 
          hover:shadow-lg hover:-translate-y-1 hover:scale-110">
            Search
          </button>
        </form>
      </div>
      <MapContainer center={position} zoom={zoom} className="flex-1 w-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {srcMarker && (
          <>
            <Marker position={srcMarker}>
              <Popup><b>Address:</b> {srcAddress}</Popup>
            </Marker>
          </>
        )}
        {destMarker && (
          <>
            <Marker position={destMarker}>
              <Popup><b>Destination:</b> {destAddress}</Popup>
            </Marker>
          </>
        )}
        {lastChanged === "src" && srcMarker && <RecenterMap position={srcMarker} />}
        {lastChanged === "dest" && destMarker && <RecenterMap position={destMarker} />}
        {lastFocused === "src" && <OnMapClicked type="src" />}
        {lastFocused === "dest" && <OnMapClicked type="dest" />}
      </MapContainer>
    </div>
  );
}
