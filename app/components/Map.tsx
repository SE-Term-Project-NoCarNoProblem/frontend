'use client'
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEffect, useState } from "react"
import { RecenterMap } from "@/app/hooks/RecenterMap"

export default function Map(props: any) {
  const { position, zoom = 10 } = props

  const [marker, setMarker] = useState<[number, number]>(position);
  const [address, setAddress] = useState<string>("");
  const [query, setQuery] = useState("");

  useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMarker([latitude, longitude]);
      },
      (err) => {
        console.warn("Geolocation error:", err);
      }
    );
  }
}, []);

  useEffect(() => {
    if (!marker) return;

    const fetchAddress = async () => {
      try {
        const [lat, lng] = marker;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json` //Usage limit: 1 request/sec per IP
        );
        const data = await res.json();
        setAddress(data.display_name || "Unknown location");
        setQuery(data.display_name || "Unknown location");
      } catch (err) {
        setAddress("Error fetching address");
      }
    };

    fetchAddress();
  }, [marker]);

  function OnMapClicked() {
    useMapEvents({
        click: (e)=>{
            console.log(e)
            const { lat, lng } = e.latlng;
            setMarker([lat, lng])
        }
    })
    return null;
  }

  async function handleSearch(e: React.FormEvent) {
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
        setMarker(coords);
        setAddress(display_name);
      } else {
        setAddress("Location not found");
      }
    } catch (err) {
      setAddress("Error searching location");
    }
  }

  return (
      <div className="flex flex-col h-screen">
      <form onSubmit={handleSearch} className="p-2 flex gap-2 bg-slate-300">
        <input
          type="text"
          value={query}
          placeholder="Enter a place"
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded-xl text-black placeholder-slate-600 focus:outline-none 
          focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-indigo-500 
        hover:shadow-lg hover:-translate-y-1 hover:scale-110">
          Search
        </button>
      </form>
    <MapContainer center={position} zoom={zoom} className="h-[100vh]">
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker && (
          <>
            <Marker position={marker}>
              <Popup><b>Address:</b> {address}</Popup>
            </Marker>
            <RecenterMap position={marker} />
          </>
        )}
        <OnMapClicked />
    </MapContainer>
    </div>
  );
}
