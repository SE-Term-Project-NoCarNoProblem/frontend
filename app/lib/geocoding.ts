/**
 * Reverse geocode coordinates to get address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise<string> - Address string or "Unknown location" on error
 */
export const reverseGeocode = async (
	lat: number,
	lng: number
): Promise<string> => {
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
		);
		const data = await res.json();
		return data.name || data.display_name || "Unknown location";
	} catch (err) {
		console.error("Reverse geocode error:", err);
		return "Unknown location";
	}
};
