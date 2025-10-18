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
  const geolocate = useRef<maplibregl.GeolocateControl | null>(null);

  const srcMarkerRef = useRef<maplibregl.Marker | null>(null);
  const destMarkerRef = useRef<maplibregl.Marker | null>(null);
  const driverMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [srcMarker, setSrcMarker] = useState<[number, number]>();
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
    geolocate.current = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.current.addControl(geolocate.current, 'top-left');
    // map.current.addControl(new maplibregl.FullscreenControl(), 'top-left');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  /* ### Get initial location ### */
  useEffect(() => {
    map.current?.on('load',()=>{
      geolocate.current?.trigger();
    })
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

  const handlePlacePin = () => {
    if (!map.current) return;
    
    const center = map.current.getCenter();
    if (lastFocused === "src") {
      setSrcMarker([center.lat, center.lng]);
    } else if (lastFocused === "dest") {
      setDestMarker([center.lat, center.lng]);
    }

    setLastFocused(null);
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Floating center pin */}
      {lastFocused && 
      <>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-8 h-8 text-4xl">📍</div>
        </div>

        <button
          onClick={handlePlacePin}
          className="button button-primary absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20"
        >
          Place Pin
        </button>
      </>
      }

      {/* Floating Search Card */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-4 space-y-3">
          <form 
            onSubmit={(e) => handleSearch(e, "src", srcQuery)}
            // onFocus={() => setLastFocused(null)}
            className="flex items-center gap-3 p-2 border-b border-gray-200"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <div className="text-emerald-600 text-xl">📍</div>
            </div>
            <div className="flex-grow">
              <input
                type="text"
                value={srcQuery}
                placeholder="Enter pickup location"
                onChange={(e) => setSrcQuery(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 bg-gray-50 rounded-lg 
                          focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button 
              type="button"
              onClick={() => lastFocused=="src" ? setLastFocused(null) : setLastFocused("src")}
              className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 transition-all duration-200
                ${lastFocused === "src" 
                  ? "bg-emerald-100 border-emerald-500 text-emerald-700" 
                  : "border-gray-300 hover:border-emerald-500 text-gray-600 hover:text-emerald-700"}`}
              title="Place pickup location on map"
            >
              📍
            </button>
            <button 
              type="submit"
              className="flex-shrink-0 bg-emerald-500 text-white px-4 py-2 rounded-lg
                        hover:bg-emerald-600 transition-colors duration-200"
            >
              Search
            </button>
          </form>

          <form
            onSubmit={(e) => handleSearch(e, "dest", destQuery)}
            // onFocus={() => setLastFocused(null)}
            className="flex items-center gap-3 p-2"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <div className="text-red-600 text-xl">📍</div>
            </div>
            <div className="flex-grow">
              <input
                type="text"
                value={destQuery}
                placeholder="Enter destination"
                onChange={(e) => setDestQuery(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 bg-gray-50 rounded-lg
                          focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button 
              type="button"
              onClick={() => lastFocused=="dest" ? setLastFocused(null) : setLastFocused("dest")}
              className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 transition-all duration-200
                ${lastFocused === "dest" 
                  ? "bg-red-100 border-red-500 text-red-700" 
                  : "border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-700"}`}
              title="Place destination on map"
            >
              📍
            </button>
            <button 
              type="submit"
              className="flex-shrink-0 bg-red-500 text-white px-4 py-2 rounded-lg
                        hover:bg-red-600 transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="flex-1 w-full" />
    </div>
  );
});

Map.displayName = "Map";
export default Map;