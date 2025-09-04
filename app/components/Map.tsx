'use client'
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useState } from "react"
import { RecenterMap } from "@/app/hooks/RecenterMap"

export default function Map(props: any) {
  const { position, zoom = 10 } = props

  const [marker, setMarker] = useState<[number, number]>(position);

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
            <Popup>tets</Popup>
        </Marker>
        <OnMapClicked />
        <RecenterMap position={marker}/>
    </MapContainer>
  );
}
