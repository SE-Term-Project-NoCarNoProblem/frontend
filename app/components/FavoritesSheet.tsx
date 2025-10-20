"use client";
import { useEffect, useState } from "react";

type Target = "src" | "dest";

interface Props {
	open: boolean;
	target: Target | null;
	topOffset?: number; // heightat the top  reserved for the search card
	onClose: () => void;
	onSelect: (
		place: { name: string; lat: number; lng: number },
		which?: Target
	) => void;
}

export default function FavoritesSheet({
	open,
	target,
	topOffset = 150, // default
	onClose,
	onSelect,
}: Props) {
	// Lock scroll while open
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Tab defaults to the field that opened the sheet,
	// and re-syncs if target changes while open.
	const [tab, setTab] = useState<"pickup" | "dropoff">(
		target === "dest" ? "dropoff" : "pickup"
	);
	useEffect(() => {
		setTab(target === "dest" ? "dropoff" : "pickup");
	}, [target]);

	if (!open) return null;

	///hardcoded first since there is still no endpoint to call and lat long here is not acctually used, just for the puurpose of
	const pickupFavorites = [
		{ name: "Home", lat: 13.7563, lng: 100.5018, distance: "1.5 km" },
		{
			name: "Chulalongkorn University",
			lat: 13.738,
			lng: 100.532,
			distance: "2.1 km",
		},
		{ name: "Central World", lat: 13.746, lng: 100.539, distance: "3.2 km" },
	];

	const dropoffFavorites = [
		{ name: "Samyan Mitrtown", lat: 13.735, lng: 100.529, distance: "2.0 km" },
		{ name: "Siam Paragon", lat: 13.746, lng: 100.534, distance: "3.0 km" },
		{ name: "ICONSIAM", lat: 13.726, lng: 100.51, distance: "5.8 km" },
	];

	const items = tab === "pickup" ? pickupFavorites : dropoffFavorites;
	const handlePick = (f: { name: string; lat: number; lng: number }) => {
		const which: Target = tab === "pickup" ? "src" : "dest";
		onSelect({ name: f.name, lat: f.lat, lng: f.lng }, which);
	};

	return (
		// Wrapper stays under the search card but above map/bottomsheet
		<div className="fixed inset-0 z-[2500] pointer-events-none">
			{/* Panel content leaves a white "notch" for the search card */}
			<div
				className="
          h-full w-full bg-white/95 backdrop-blur-sm
          rounded-t-3xl shadow-xl overflow-auto
          pointer-events-auto
          transition-transform duration-300 ease-out
        "
				style={{ paddingTop: topOffset }}
				role="dialog"
				aria-modal="true"
			>
				{/* Main content container */}
				<div className="mx-auto w-full max-w-3xl px-4">
					{/* Tabs */}
					<div className="pt-3">
						<div className="flex gap-2 justify-center">
							{" "}
							{/* centered tabs */}
							<button
								onClick={() => setTab("pickup")}
								className={`px-3 py-2 rounded-xl text-sm font-medium border
          ${
						tab === "pickup"
							? "bg-slate-900 text-white border-slate-900"
							: "text-slate-500 hover:bg-slate-50"
					}`}
							>
								favorite pick up
							</button>
							<button
								onClick={() => setTab("dropoff")}
								className={`px-3 py-2 rounded-xl text-sm font-medium border
          ${
						tab === "dropoff"
							? "bg-slate-900 text-white border-slate-900"
							: "text-slate-500 hover:bg-slate-50"
					}`}
							>
								favorite drop off
							</button>
						</div>
					</div>

					{/* List */}
					<div className="p-4 space-y-3">
						{items.map((f, i) => (
							<button
								key={i}
								onClick={() => handlePick(f)}
								className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-2xl hover:shadow-md hover:border-gray-500 transition"
							>
								<div className="flex items-center gap-3">
									<span className="text-xl">🚗</span>
									<div className="text-left">
										<div className="font-semibold text-gray-800">{f.name}</div>
										<div className="text-xs text-gray-600">{f.distance}</div>
									</div>
								</div>
								<span className="text-gray-500 text-lg">📍</span>
							</button>
						))}
					</div>

					{/* Footer */}
					<div className="p-4 border-t">
						<button
							onClick={onClose}
							className="w-full py-3 rounded-2xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
						>
							Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
