import { useMap } from "react-leaflet";

export function RecenterMap({ position } : { position: [number, number] }) {
    const map = useMap();

    if (!position || position.length !== 2) return;
    map.setView(position, 10);

    return null;
}