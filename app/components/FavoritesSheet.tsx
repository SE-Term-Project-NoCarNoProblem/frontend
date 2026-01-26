"use client";
import { useEffect, useState } from "react";

type Target = "src" | "dest";
type FavoritesTab = "pickup" | "dropoff";

type FavoritePlace = {
	name: string;
	lat: number;
	lng: number;
	distance: string;
};

interface Props {
	open: boolean;
	target: Target | null;
	topOffset?: number;
	onClose: () => void;
	onSelect: (
		place: { name: string; lat: number; lng: number },
		which?: Target
	) => void;

	pickupFavorites: FavoritePlace[];
	dropoffFavorites: FavoritePlace[];
	onDeleteFavorite: (which: FavoritesTab, index: number) => void;
}


export default function FavoritesSheet({
	open,
	target,
	topOffset = 150,
	onClose,
	onSelect,
	pickupFavorites,
	dropoffFavorites,
	onDeleteFavorite,
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
	const [tab, setTab] = useState<FavoritesTab>(
		target === "dest" ? "dropoff" : "pickup"
	);
	useEffect(() => {
		setTab(target === "dest" ? "dropoff" : "pickup");
	}, [target]);

	if (!open) return null;

	const items = tab === "pickup" ? pickupFavorites : dropoffFavorites;

	const handlePick = (f: FavoritePlace) => {
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
          ${tab === "pickup"
										? "bg-slate-900 text-white border-slate-900"
										: "text-slate-500 hover:bg-slate-50"
									}`}
							>
								favorite pick up
							</button>
							<button
								onClick={() => setTab("dropoff")}
								className={`px-3 py-2 rounded-xl text-sm font-medium border
          ${tab === "dropoff"
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
							<div
								key={i}
								onClick={() => handlePick(f)}
								className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-2xl hover:shadow-md hover:border-gray-500 transition cursor-pointer"
							>
								<div className="flex items-center gap-3">
									<span className="text-xl">🚗</span>
									<div className="text-left">
										<div className="font-semibold text-gray-800">{f.name}</div>
										<div className="text-xs text-gray-600">{f.distance}</div>
									</div>
								</div>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();          // don't trigger pick
										onDeleteFavorite(tab, i);     // tell parent to delete
									}}
									className="ml-3 w-8 h-8 flex items-center justify-center rounded-full border border-red-300 text-red-500 text-lg leading-none hover:bg-red-50"
								>
									-
								</button>
							</div>
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
