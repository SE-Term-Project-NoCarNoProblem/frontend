'use client'
import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function Map(props: any) {
  const { position, zoom } = props

  function OnMapClicked() {
    useMapEvents({
        click: (e)=>{
            console.log(e)
            //TODO: update marker's location(mayhaps zoom in to fit screen?)
        }
    })
    return null;
  }

  return (
    //TODO: set user's current location as center
    <MapContainer center={[13.7563, 100.5018]} zoom={13} className="h-[100vh]">
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[13.7563, 100.5018]}>
            <Popup>tets</Popup>
        </Marker>
        <OnMapClicked />
    </MapContainer>
  );
}
