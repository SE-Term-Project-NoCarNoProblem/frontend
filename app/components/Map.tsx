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

  useEffect(() => {
    if (!marker) return;

    const fetchAddress = async () => {
      try {
        const [lat, lng] = marker;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || "Unknown location");
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

  return (
    <MapContainer center={position} zoom={zoom} className="h-[100vh]">
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={marker}>
            <Popup>
              <b>Coords:</b> {marker[0].toFixed(4)}, {marker[1].toFixed(4)} <br />
              <b>Address:</b> {address}
            </Popup>
        </Marker>
        <OnMapClicked />
        <RecenterMap position={marker}/>
    </MapContainer>
  );
}
