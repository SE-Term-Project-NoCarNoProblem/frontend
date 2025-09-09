import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        if (!position || position.length !== 2) return;
        map.setView(position, 13);
    }, [position, map]);

    return null;
}