'use client'
import { forwardRef, useEffect, useImperativeHandle, useState, useRef } from "react"
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { fetchWithAuth } from "../lib/api"

export type MapHandle = {
  requestRide: () => void;
};

type MapProps = {
  position: [number, number];
  zoom?: number;
  drivers?: [number, number][];
};

const Map = forwardRef<MapHandle, MapProps>(({ position, zoom = 13, drivers = [] }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const srcMarkerRef = useRef<maplibregl.Marker | null>(null);
  const destMarkerRef = useRef<maplibregl.Marker | null>(null);
  const driverMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [srcMarker, setSrcMarker] = useState<[number, number]>(position);
  const [srcAddress, setSrcAddress] = useState<string>("");
  const [srcQuery, setSrcQuery] = useState("");
  const [destMarker, setDestMarker] = useState<[number, number] | null>(null);
  const [destAddress, setDestAddress] = useState<string>("");
  const [destQuery, setDestQuery] = useState("");
  const [lastFocused, setLastFocused] = useState<"src" | "dest" | null>(null);

  /* === requestRide exposed to parent === */
  useImperativeHandle(ref, () => ({
    requestRide() {
      console.log("🚖 Requesting ride with:", {
        src: srcMarker,
        dest: destMarker,
      });
      if (!srcMarker || !destMarker) {
        alert("Please select both pickup and destination!");
        return;
      }

      fetchWithAuth("http://localhost:8000/api/requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "car",
          note_to_driver: "test",
          pickup_lng: srcMarker[1], pickup_lat: srcMarker[0],
          dropoff_lng: destMarker[1], dropoff_lat: destMarker[0],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Ride requested:", data);
        })
        .catch((err) => {
          console.error("❌ Backend error:", err);
        });
    },
  }));

  /* ### Initialize map ### */
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // map.current = new maplibregl.Map({
    //   container: mapContainer.current,
    //   style: {
    //     version: 8,
    //     sources: {
    //       osm: {
    //         type: 'raster',
    //         tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    //         tileSize: 256,
    //         attribution: '&copy; OpenStreetMap Contributors',
    //         maxzoom: 19
    //       }
    //     },
    //     layers: [
    //       {
    //         id: 'osm',
    //         type: 'raster',
    //         source: 'osm'
    //       }
    //     ]
    //   },
    //   center: [position[1], position[0]], // [lng, lat]
    //   zoom: zoom,
    // });

    map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [100.507, 13.745],
        zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');
    map.current.addControl(new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-left');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-left');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    // Handle map clicks
    map.current.on('click', (e) => {
      if (lastFocused === "src") {
        setSrcMarker([e.lngLat.lat, e.lngLat.lng]);
      } else if (lastFocused === "dest") {
        setDestMarker([e.lngLat.lat, e.lngLat.lng]);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  /* ### Get initial location ### */
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setSrcMarker([latitude, longitude]);
          map.current?.flyTo({ center: [longitude, latitude], zoom: 13 });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  /* ### Update source marker ### */
  useEffect(() => {
    if (!map.current || !srcMarker) return;

    // Remove old marker
    if (srcMarkerRef.current) {
      srcMarkerRef.current.remove();
    }

    // Create custom green marker element
    const el = document.createElement('div');
    el.className = 'src-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#10b981';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';

    // Create popup
    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<div><b>Pickup:</b><br/>${srcAddress || 'Loading...'}</div>`);

    // Add new marker
    srcMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([srcMarker[1], srcMarker[0]])
      .setPopup(popup)
      .addTo(map.current);

    // Reverse geocode
    reverseGeocode(srcMarker[0], srcMarker[1]).then((display_name) => {
      setSrcAddress(display_name);
      setSrcQuery(display_name);
      popup.setHTML(`<div><b>Pickup:</b><br/>${display_name}</div>`);
    });

    map.current.flyTo({ center: [srcMarker[1], srcMarker[0]], zoom: 15 });
  }, [srcMarker]);

  /* ### Update destination marker ### */
  useEffect(() => {
    if (!map.current) return;

    // Remove old marker
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }

    if (!destMarker) return;

    // Create custom red marker element
    const el = document.createElement('div');
    el.className = 'dest-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#ef4444';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';

    // Create popup
    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<div><b>Destination:</b><br/>${destAddress || 'Loading...'}</div>`);

    // Add new marker
    destMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([destMarker[1], destMarker[0]])
      .setPopup(popup)
      .addTo(map.current);

    // Reverse geocode
    reverseGeocode(destMarker[0], destMarker[1]).then((display_name) => {
      setDestAddress(display_name);
      setDestQuery(display_name);
      popup.setHTML(`<div><b>Destination:</b><br/>${display_name}</div>`);
    });

    map.current.flyTo({ center: [destMarker[1], destMarker[0]], zoom: 15 });
  }, [destMarker]);

  /* ### Update driver markers ### */
  useEffect(() => {
    if (!map.current) return;

    // Remove old driver markers
    driverMarkersRef.current.forEach(marker => marker.remove());
    driverMarkersRef.current = [];

    // Add new driver markers
    drivers.forEach((driverPos, idx) => {
      // Create custom driver marker element (car icon style)
      const el = document.createElement('div');
      el.innerHTML = '🚗';
      el.style.fontSize = '24px';
      el.style.cursor = 'pointer';

      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`<div><b>Driver #${idx + 1}</b></div>`);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([driverPos[1], driverPos[0]])
        .setPopup(popup)
        .addTo(map.current!);

      driverMarkersRef.current.push(marker);
    });
  }, [drivers]);

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
  async function handleSearch(e: React.FormEvent, type: "src" | "dest", query: string) {
    e.preventDefault();
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

  return (
    <div className="flex flex-col h-screen relative">
      {/* Search Forms */}
      <div className="flex flex-col w-full z-10">
        <form 
          onSubmit={(e) => handleSearch(e, "src", srcQuery)} 
          className="flex-1 p-2 flex gap-2 bg-slate-300 border border-emerald-500 border-1 hover:border-3"
          onFocus={() => setLastFocused("src")}
        >
          <div className="text-emerald-600 text-xl my-auto font-semibold">Pickup</div>
          <input
            type="text"
            value={srcQuery}
            placeholder="Enter pickup location"
            onChange={(e) => setSrcQuery(e.target.value)}
            className="flex-1 p-2 border rounded-xl text-black placeholder-slate-600 focus:outline-none 
            focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
            hover:shadow-lg transition-all duration-200"
          >
            Search
          </button>
        </form>
        
        <form 
          onSubmit={(e) => handleSearch(e, "dest", destQuery)} 
          className="flex-1 p-2 flex gap-2 bg-slate-300 border border-red-500 border hover:border-3"
          onFocus={() => setLastFocused("dest")}
        >
          <div className="text-red-600 text-xl my-auto font-semibold">Destination</div>
          <input
            type="text"
            value={destQuery}
            placeholder="Enter destination"
            onChange={(e) => setDestQuery(e.target.value)}
            className="flex-1 p-2 border rounded-xl text-black placeholder-slate-600 focus:outline-none 
            focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
            hover:shadow-lg transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="flex-1 w-full" />
    </div>
  );
});

Map.displayName = "Map";
export default Map;