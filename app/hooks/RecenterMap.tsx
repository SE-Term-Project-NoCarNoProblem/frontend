import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position);
    }, [position, map]);

    return null;
}