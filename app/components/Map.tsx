"use client";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
	useRef,
	useLayoutEffect,
} from "react";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fetchWithAuth } from "../lib/api";
import FavoritesSheet from "./FavoritesSheet";
import ChooseRideCard from "./ChooseRideCard";

export type MapHandle = {
	requestRide: () => void;
	fitBounds?: (bounds: [[number, number], [number, number]]) => void;
};

type UserMode = "customer" | "driver";

type MapProps = {
	drivers?: [number, number][];
	userMode?: UserMode;
	onModeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	srcMarker?: [number, number] | null;
	srcAddress?: string;
	destMarker?: [number, number] | null;
	destAddress?: string;
	srcQuery: string;
	destQuery: string;
	onSrcQueryChange: (query: string) => void;
	onDestQueryChange: (query: string) => void;
	onSrcSearch: () => void;
	onDestSearch: () => void;
	onSrcMarkerSet: (coords: [number, number] | null) => void;
	onDestMarkerSet: (coords: [number, number] | null) => void;
	showFavorites: boolean;
	favoritesTarget: "src" | "dest" | null;
	onShowFavoritesChange: (show: boolean) => void;
	onFavoritesTargetChange: (target: "src" | "dest" | null) => void;
	onCurrentPositionChange?: (coords: [number, number] | null) => void;
};

const Map = forwardRef<MapHandle, MapProps>(
	(
		{
			drivers = [],
			userMode = "customer",
			onModeChange,
			srcMarker,
			srcAddress,
			destMarker,
			destAddress,
			srcQuery,
			destQuery,
			onSrcQueryChange,
			onDestQueryChange,
			onSrcSearch,
			onDestSearch,
			onSrcMarkerSet,
			onDestMarkerSet,
			showFavorites,
			favoritesTarget,
			onShowFavoritesChange,
			onFavoritesTargetChange,
			onCurrentPositionChange,
		},
		ref
	) => {
		const mapContainer = useRef<HTMLDivElement>(null);
		const map = useRef<maplibregl.Map | null>(null);
		const geolocate = useRef<maplibregl.GeolocateControl | null>(null);

		const srcMarkerRef = useRef<maplibregl.Marker | null>(null);
		const destMarkerRef = useRef<maplibregl.Marker | null>(null);
		const driverMarkersRef = useRef<maplibregl.Marker[]>([]);

		const [lastFocused, setLastFocused] = useState<"src" | "dest" | null>(null);

		const searchRef = useRef<HTMLDivElement>(null);
		const [searchH, setSearchH] = useState(0);

		useLayoutEffect(() => {
			if (!searchRef.current) return;
			const el = searchRef.current;

			const setH = () => setSearchH(el.offsetHeight + 50);
			setH();

			const ro = new ResizeObserver(() => setH());
			ro.observe(el);
			window.addEventListener("resize", setH);

			return () => {
				ro.disconnect();
				window.removeEventListener("resize", setH);
			};
		}, []);

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
						pickup_lng: srcMarker[1],
						pickup_lat: srcMarker[0],
						dropoff_lng: destMarker[1],
						dropoff_lat: destMarker[0],
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
			fitBounds(bounds: [[number, number], [number, number]]) {
				if (!map.current) return;

				const [[minLat, minLng], [maxLat, maxLng]] = bounds;

				map.current.fitBounds(
					[
						[minLng, minLat],
						[maxLng, maxLat],
					],
					{
						padding: 50,
						duration: 1000,
					}
				);
			},
		}));

		/* ### Initialize map ### */
		useEffect(() => {
			if (!mapContainer.current || map.current) return;

			map.current = new maplibregl.Map({
				container: mapContainer.current,
				style: "https://tiles.openfreemap.org/styles/bright",
				center: [100.507, 13.745],
				zoom: 9,
			});

			// map.current.addControl(new maplibregl.NavigationControl(), "top-left");
			geolocate.current = new maplibregl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			});
			map.current.addControl(geolocate.current, "top-left");
			// map.current.addControl(new maplibregl.ScaleControl(), "bottom-left");

			return () => {
				map.current?.remove();
				map.current = null;
			};
		}, []);

		/* ### Get initial location ### */
		useEffect(() => {
			map.current?.on("load", () => {
				geolocate.current?.trigger();
			});

			// Listen to geolocate events to track user position
			geolocate.current?.on("geolocate", (e: GeolocationPosition) => {
				const coords: [number, number] = [
					e.coords.latitude,
					e.coords.longitude,
				];
				console.log("📍 Current position updated:", coords);
				onCurrentPositionChange?.(coords);
			});
		}, [onCurrentPositionChange]);

		/* ### Update source marker ### */
		useEffect(() => {
			if (!map.current) return;

			if (srcMarkerRef.current) {
				srcMarkerRef.current.remove();
				srcMarkerRef.current = null;
			}

			if (!srcMarker) return;

			const el = document.createElement("div");
			el.className = "src-marker";
			el.style.width = "30px";
			el.style.height = "30px";
			el.style.borderRadius = "50%";
			el.style.backgroundColor = "#10b981";
			el.style.border = "3px solid white";
			el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
			el.style.cursor = "pointer";

			const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
				`<div><b>Pickup:</b><br/>${srcAddress || "Loading..."}</div>`
			);

			srcMarkerRef.current = new maplibregl.Marker({ element: el })
				.setLngLat([srcMarker[1], srcMarker[0]])
				.setPopup(popup)
				.addTo(map.current);

			popup.setHTML(`<div><b>Pickup:</b><br/>${srcAddress}</div>`);
			// map.current.flyTo({ center: [srcMarker[1], srcMarker[0]] });
		}, [srcMarker, srcAddress]);

		/* ### Update destination marker ### */
		useEffect(() => {
			if (!map.current) return;

			if (destMarkerRef.current) {
				destMarkerRef.current.remove();
				destMarkerRef.current = null;
			}

			if (!destMarker) return;

			const el = document.createElement("div");
			el.className = "dest-marker";
			el.style.width = "30px";
			el.style.height = "30px";
			el.style.borderRadius = "50%";
			el.style.backgroundColor = "#ef4444";
			el.style.border = "3px solid white";
			el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
			el.style.cursor = "pointer";

			const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
				`<div><b>Destination:</b><br/>${destAddress || "Loading..."}</div>`
			);

			destMarkerRef.current = new maplibregl.Marker({ element: el })
				.setLngLat([destMarker[1], destMarker[0]])
				.setPopup(popup)
				.addTo(map.current);

			popup.setHTML(`<div><b>Destination:</b><br/>${destAddress}</div>`);
			// map.current.flyTo({ center: [destMarker[1], destMarker[0]] });
		}, [destMarker, destAddress]);

		/* ### Update driver markers ### */
		useEffect(() => {
			if (!map.current) return;

			driverMarkersRef.current.forEach((marker) => marker.remove());
			driverMarkersRef.current = [];

			drivers.forEach((driverPos, idx) => {
				const el = document.createElement("div");
				el.innerHTML = "🚗";
				el.style.fontSize = "24px";
				el.style.cursor = "pointer";

				const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
					`<div><b>Driver #${idx + 1}</b></div>`
				);

				const marker = new maplibregl.Marker({ element: el })
					.setLngLat([driverPos[1], driverPos[0]])
					.setPopup(popup)
					.addTo(map.current!);

				driverMarkersRef.current.push(marker);
			});
		}, [drivers]);

		const handlePlacePin = () => {
			if (!map.current) return;

			const center = map.current.getCenter();
			if (lastFocused === "src") {
				onSrcMarkerSet([center.lat, center.lng]);
			} else if (lastFocused === "dest") {
				onDestMarkerSet([center.lat, center.lng]);
			}

			setLastFocused(null);
		};

		return (
			<div className="flex flex-col h-screen relative">
				{lastFocused && (
					<>
						<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
							<div className="w-8 h-8 text-4xl">📍</div>
						</div>

						<button
							onClick={handlePlacePin}
							className="button button-primary absolute bottom-1/3 left-1/2 transform -translate-x-1/2 z-20"
						>
							Place Pin
						</button>
					</>
				)}

				<div
					ref={searchRef}
					className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[3000] w-[90%] max-w-2xl"
				>
					<div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 space-y-3">
						{/* Pickup Location */}
						{userMode == "customer" && (
							<div className="flex items-center gap-2 sm:gap-3 p-2 border-b border-gray-200">
								<div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
									<div className="text-emerald-600 text-lg sm:text-xl">📍</div>
								</div>
								<div className="flex-grow min-w-0">
									<input
										type="text"
										value={srcQuery}
										placeholder="Enter pickup location"
										onChange={(e) => onSrcQueryChange(e.target.value)}
										onFocus={() => {
											onFavoritesTargetChange("src");
											onShowFavoritesChange(true);
										}}
										onClick={() => {
											onFavoritesTargetChange("src");
											onShowFavoritesChange(true);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												onSrcSearch();
											}
										}}
										className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-50 rounded-lg 
                          focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
									/>
								</div>
								<button
									type="button"
									onClick={() =>
										lastFocused == "src"
											? setLastFocused(null)
											: setLastFocused("src")
									}
									className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border-2 transition-all duration-200
                ${
									lastFocused === "src"
										? "bg-emerald-100 border-emerald-500 text-emerald-700"
										: "border-gray-300 hover:border-emerald-500 text-gray-600 hover:text-emerald-700"
								}`}
									title="Place pickup location on map"
								>
									📍
								</button>
								<button
									type="button"
									onClick={() => onSrcSearch()}
									className="hidden sm:flex flex-shrink-0 bg-emerald-500 text-white px-4 py-2 text-base rounded-lg
                        hover:bg-emerald-600 transition-colors duration-200"
								>
									Search
								</button>
							</div>
						)}

						{/* Destination */}
						{userMode == "customer" && (
							<div className="flex items-center gap-2 sm:gap-3 p-2 border-b border-gray-200">
								<div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
									<div className="text-red-600 text-lg sm:text-xl">📍</div>
								</div>
								<div className="flex-grow min-w-0">
									<input
										type="text"
										value={destQuery}
										placeholder="Enter destination"
										onChange={(e) => onDestQueryChange(e.target.value)}
										onFocus={() => {
											onFavoritesTargetChange("dest");
											onShowFavoritesChange(true);
										}}
										onClick={() => {
											onFavoritesTargetChange("dest");
											onShowFavoritesChange(true);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												onDestSearch();
											}
										}}
										className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-50 rounded-lg
                          focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500"
									/>
								</div>
								<button
									type="button"
									onClick={() =>
										lastFocused == "dest"
											? setLastFocused(null)
											: setLastFocused("dest")
									}
									className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border-2 transition-all duration-200
                ${
									lastFocused === "dest"
										? "bg-red-100 border-red-500 text-red-700"
										: "border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-700"
								}`}
									title="Place destination on map"
								>
									📍
								</button>
								<button
									type="button"
									onClick={() => onDestSearch()}
									className="hidden sm:flex flex-shrink-0 bg-red-500 text-white px-4 py-2 text-base rounded-lg
                        hover:bg-red-600 transition-colors duration-200"
								>
									Search
								</button>
							</div>
						)}

						{/* Mode Selector */}
						<div className="flex items-center gap-2 sm:gap-3 px-2 pt-1">
							<div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
								<div className="text-blue-600 text-lg sm:text-xl">
									{userMode === "customer" ? "👤" : "🚗"}
								</div>
							</div>
							<div className="flex-grow">
								<select
									value={userMode}
									onChange={onModeChange}
									className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-50 rounded-lg
									border border-gray-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
								>
									<option value="customer">👤 Customer</option>
									<option value="driver">🚗 Driver</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div ref={mapContainer} className="flex-1 w-full" />

				<FavoritesSheet
					open={showFavorites}
					target={favoritesTarget}
					topOffset={searchH}
					onClose={() => onShowFavoritesChange(false)}
					onSelect={(place, which) => {
						const coords: [number, number] = [place.lat, place.lng];
						const applyTo = which ?? favoritesTarget;

						if (applyTo === "src") {
							onSrcMarkerSet(coords);
							onSrcQueryChange(place.name);
						} else if (applyTo === "dest") {
							onDestMarkerSet(coords);
							onDestQueryChange(place.name);
						}

						onShowFavoritesChange(false);
						onFavoritesTargetChange(null);
					}}
				/>
			</div>
		);
	}
);

Map.displayName = "Map";
export default Map;
