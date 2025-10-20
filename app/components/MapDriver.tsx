"use client";
import {
	MapContainer,
	Marker,
	TileLayer,
	Popup,
	useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useState } from "react";
import { RecenterMap } from "@/app/hooks/RecenterMap";
import L from "leaflet";

// Red marker (drivers)
export const driverIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

export default function Map(props: any) {
	const { position, zoom = 13, drivers = [] } = props;
	const [marker, setMarker] = useState<[number, number]>(position);

	function OnMapClicked() {
		useMapEvents({
			click: (e) => {
				const { lat, lng } = e.latlng;
				setMarker([lat, lng]);
			},
		});
		return null;
	}

	return (
		<MapContainer center={position} zoom={zoom} className="h-[100vh]">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{/* User marker */}
			<Marker position={marker}>
				<Popup>Your Location</Popup>
			</Marker>

			{/* Driver markers */}
			{drivers.map((driverPos: [number, number], idx: number) => (
				<Marker key={idx} position={driverPos} icon={driverIcon}>
					<Popup>Driver #{idx + 1}</Popup>
				</Marker>
			))}

			<OnMapClicked />
			<RecenterMap position={marker} />
		</MapContainer>
	);
}
