"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth } from "../lib/api";

// ---- Types ---------------------------------------------------------------
export type VehicleType = "motorcycle" | "car" | "van";
export type RideStatus = "ongoing" | "completed" | "canceled";
export type EndReason =
	| "completed"
	| "customer_canceled"
	| "driver_canceled"
	| "no_show";

export interface RideItem {
	id: string;
	vehicleType: VehicleType;
	driverName: string;
	vehicle: {
		color: string;
		model: string;
		plate: string;
	};
	pickup: string;
	destination: string;
	priceTHB: number;
	rating?: number | null;
	status: RideStatus;
	requestedAt: string;
	endedAt?: string | null;
	endReason?: EndReason | null;
}

type BackendRideHistoryItem = {
	id: string;
	fare: number;
	requested_at: string;
	ended_at?: string | null;
	end_reason?: EndReason | null;
	ride_status: RideStatus;
	ride_progress_status: string;
	rating?: number | null;
	pickup_lat?: number | null;
	pickup_lng?: number | null;
	pickup_address?: string | null;
	dropoff_lat?: number | null;
	dropoff_lng?: number | null;
	dropoff_address?: string | null;
	driver?: {
		id: string;
		name: string | null;
		avatar: string | null;
	} | null;
	customer?: {
		id: string;
		name: string | null;
		avatar: string | null;
	} | null;
	vehicle?: {
		id: string;
		model: string | null;
		make: string | null;
		color: string | null;
		registration: string | null;
		type: VehicleType | null;
	} | null;
};

// ---- Helpers -------------------------------------------------------------
function formatThai(dtIso?: string) {
	if (!dtIso) return "";
	try {
		const d = new Date(dtIso);
		const fmtDate = new Intl.DateTimeFormat("en-GB", {
			timeZone: "Asia/Bangkok",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(d);
		const fmtTime = new Intl.DateTimeFormat("en-GB", {
			timeZone: "Asia/Bangkok",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}).format(d);
		return `${fmtDate} ${fmtTime}`; // DD/MM/YYYY HH:mm
	} catch {
		return dtIso!;
	}
}

function formatTHB(n: number) {
	try {
		return new Intl.NumberFormat("th-TH", {
			style: "currency",
			currency: "THB",
			maximumFractionDigits: 0,
		}).format(n);
	} catch {
		return `฿${n}`;
	}
}

function formatCoords(lat?: number | null, lng?: number | null) {
	if (
		lat === undefined ||
		lng === undefined ||
		lat === null ||
		lng === null ||
		Number.isNaN(lat) ||
		Number.isNaN(lng)
	) {
		return "Location unavailable";
	}
	return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function buildVehicleModel(make?: string | null, model?: string | null) {
	const parts = [make, model].filter(Boolean);
	return parts.length ? parts.join(" ") : "-";
}

function mapRideFromApi(ride: BackendRideHistoryItem): RideItem {
	const vehicleType = (ride.vehicle?.type as VehicleType | undefined) ?? "car";
	const ratingValue =
		typeof ride.rating === "number" && ride.rating >= 1
			? Math.min(5, Math.max(1, Math.round(ride.rating)))
			: null;

	// Use address if available, otherwise fall back to coordinates
	const pickupDisplay = ride.pickup_address || formatCoords(ride.pickup_lat, ride.pickup_lng);
	const dropoffDisplay = ride.dropoff_address || formatCoords(ride.dropoff_lat, ride.dropoff_lng);

	return {
		id: ride.id,
		vehicleType,
		driverName: ride.driver?.name ?? "Unknown driver",
		vehicle: {
			color: ride.vehicle?.color ?? "-",
			model: buildVehicleModel(ride.vehicle?.make, ride.vehicle?.model),
			plate: ride.vehicle?.registration ?? "-",
		},
		pickup: pickupDisplay,
		destination: dropoffDisplay,
		priceTHB: Math.round(ride.fare ?? 0),
		rating: ratingValue,
		status: ride.ride_status,
		requestedAt: ride.requested_at,
		endedAt: ride.ended_at ?? null,
		endReason: ride.end_reason ?? null,
	};
}

const clamp2 = {
	display: "-webkit-box",
	WebkitLineClamp: 2,
	WebkitBoxOrient: "vertical" as const,
	overflow: "hidden",
};

const VEHICLE_ICON: Record<VehicleType, string> = {
	motorcycle: "/icons/motorcycle.svg",
	car: "/icons/car3.svg",
	van: "/icons/van.svg",
};

const HISTORY_PAGE_LIMIT = 50;

export default function RideHistoryPage() {
	const router = useRouter();
	const [openId, setOpenId] = useState<string | null>(null);
	const [rides, setRides] = useState<RideItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRides = useCallback(async () => {
		const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
		if (!baseUrl) {
			setError("Backend URL is not configured");
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			const response = await fetchWithAuth(
				`${baseUrl}/rides/me/history?limit=${HISTORY_PAGE_LIMIT}`
			);
			if (!response.ok) {
				const message = await response.text();
				throw new Error(message || `Request failed (${response.status})`);
			}
			const data: BackendRideHistoryItem[] = await response.json();
			setRides(data.map(mapRideFromApi));
		} catch (err) {
			console.error("Failed to load ride history", err);
			setError(
				err instanceof Error
					? err.message
					: "Unable to load ride history. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRides();
	}, [fetchRides]);

	const handleToggle = (id: string) =>
		setOpenId((prev) => (prev === id ? null : id));

	const onIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		const kind = img.dataset.kind;
		const svgChevron =
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230E4B5D" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>'
			);
		const svgCar =
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230E4B5D" stroke-width="2"><path d="M3 12l2-5h14l2 5v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2H8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>'
			);
		img.src = kind === "dropdown" ? svgChevron : svgCar; // fallback
	};

	const statusChip = (s: RideStatus) => {
		const base = "px-2 py-1 rounded-full text-xs font-semibold";
		if (s === "completed") return `${base} bg-green-100 text-green-800`;
		if (s === "ongoing") return `${base} bg-blue-100 text-blue-800`;
		return `${base} bg-rose-100 text-rose-800`;
	};

	const EndReasonText: Record<EndReason, string> = {
		completed: "Completed",
		customer_canceled: "Customer canceled",
		driver_canceled: "Driver canceled",
		no_show: "No show",
	};

	const Stars = ({ n }: { n?: number | null }) => {
		if (!n) {
			return <span className="text-xs text-slate-500">No rating</span>;
		}
		return (
			<div
				className="flex items-center gap-0.5"
				aria-label={`${n} out of 5 stars`}
			>
				{Array.from({ length: 5 }).map((_, i) => (
					<svg
						key={i}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill={i < n ? "currentColor" : "none"}
						stroke="currentColor"
						className={`h-4 w-4 ${i < n ? "text-amber-500" : "text-slate-400"}`}
					>
						<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
					</svg>
				))}
			</div>
		);
	};

	return (
		<main className="min-h-dvh bg-white text-slate-800">
			{/* Top bar */}
			<div className="sticky top-0 z-10 w-full bg-[#0E4B5D] text-white">
				<div className="mx-auto flex h-14 max-w-screen-sm items-center gap-3 px-3 sm:px-4">
					<button
						type="button"
						aria-label="Go back"
						onClick={() => router.back()}
						className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="h-6 w-6"
						>
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>
					<h1 className="text-xl font-semibold tracking-tight">Ride History</h1>
				</div>
			</div>

			{/* List */}
			<div className="mx-auto max-w-screen-sm px-3 pb-10 sm:px-4">
				<div className="bg-white px-3 sm:px-4">
					{error && (
						<div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
							<div className="font-semibold">Failed to load ride history</div>
							<p className="mt-1">{error}</p>
							<button
								onClick={fetchRides}
								className="mt-2 rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
							>
								Retry
							</button>
						</div>
					)}
					{isLoading && !error && (
						<div className="py-6 text-center text-sm text-slate-500">
							Loading ride history…
						</div>
					)}
					{!isLoading && !error && rides.length === 0 && (
						<div className="py-6 text-center text-sm text-slate-500">
							No rides found yet.
						</div>
					)}
					<ul className="divide-y divide-slate-200">
						{rides.map((r) => {
							const expanded = openId === r.id;
							return (
								<li key={r.id} className="py-4">
									{/* Row */}
									<div className="flex items-start gap-3">
										<img
											src={VEHICLE_ICON[r.vehicleType]}
											alt={r.vehicleType}
											width={24}
											height={24}
											data-kind="vehicle"
											onError={onIconError}
											className="h-7 w-7 shrink-0"
										/>

										<div className="min-w-0 flex-1">
											<div className="flex items-start justify-between gap-3">
												<div className="min-w-0">
													<div className="flex flex-wrap items-center gap-2">
														<h3 className="truncate text-[15px] font-semibold text-slate-900">
															{r.driverName}
														</h3>
														<span className={statusChip(r.status)}>
															{r.status}
														</span>
													</div>
													<div className="mt-0.5 text-xs font-semibold text-slate-700">
														Requested • {formatThai(r.requestedAt)}
													</div>
												</div>

												<button
													onClick={() => handleToggle(r.id)}
													aria-expanded={expanded}
													className={`-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#0E4B5D] hover:bg-slate-100 active:bg-slate-200 ${expanded ? "rotate-180" : ""} transition-transform`}
												>
													<img
														src="/icons/dropdown.svg"
														alt="toggle"
														width={20}
														height={20}
														data-kind="dropdown"
														onError={onIconError}
														className="h-7 w-7"
													/>
												</button>
											</div>

											{/* Route snippet (2 lines max) */}
											{!expanded && (
												<p
													className="mt-2 text-sm text-slate-600"
													style={clamp2}
												>
													{r.pickup} → {r.destination}
												</p>
											)}

											{/* Expanded Content */}
											{expanded && (
												<div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
													{/* Route & price */}
													<div className="flex flex-col gap-2">
														<div className="flex items-start gap-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																className="mt-1 h-8 w-4 text-[#0E4B5D]"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
															>
																<path d="M12 2v20" />
																<path d="M5 15l7 7 7-7" />
															</svg>

															<div className="min-w-0">
																<div className="truncate font-medium text-slate-900">
																	{r.pickup}
																</div>
																<div className="truncate text-slate-600">
																	{r.destination}
																</div>
															</div>
														</div>
														<div className="text-[13px] text-slate-700">
															<span className="font-semibold text-slate-800">
																Price:{" "}
															</span>
															{formatTHB(r.priceTHB)}
														</div>
													</div>

													{/* Vehicle & driver */}
													<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
														<div className="text-[13px]">
															<span className="font-semibold text-slate-800">
																Driver:{" "}
															</span>
															{r.driverName}
														</div>
														<div className="text-[13px]">
															<span className="font-semibold text-slate-800">
																Vehicle:{" "}
															</span>
															{r.vehicle.color} {r.vehicle.model}
														</div>
														<div className="text-[13px]">
															<span className="font-semibold text-slate-800">
																Plate:{" "}
															</span>
															{r.vehicle.plate}
														</div>
														<div className="text-[13px] flex items-center gap-2">
															<span className="font-semibold text-slate-800">
																Rating:{" "}
															</span>
															<Stars n={r.rating} />
														</div>
													</div>

													{/* Status & times */}
													<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
														<div className="text-[13px]">
															<span className="font-semibold text-slate-800">
																Status:{" "}
															</span>
															<span className={statusChip(r.status)}>
																{r.status}
															</span>
														</div>
														<div className="text-[13px]">
															<span className="font-semibold text-slate-800">
																Requested at:{" "}
															</span>
															{formatThai(r.requestedAt)}
														</div>
														{r.endedAt && (
															<div className="text-[13px]">
																<span className="font-semibold text-slate-800">
																	Ended at:{" "}
																</span>
																{formatThai(r.endedAt)}
															</div>
														)}
														{r.endReason && (
															<div className="text-[13px]">
																<span className="font-semibold text-slate-800">
																	End reason:{" "}
																</span>
																{EndReasonText[r.endReason]}
															</div>
														)}
													</div>
													{/* File a ticket button */}
													<div className="mt-4">
														<Link
															href={`/file-ticket?rideId=${r.id}`}
															className="block w-full rounded-lg bg-[#0E4B5D] py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0c3f4e] active:bg-[#0a3442]"
														>
															File a Ticket
														</Link>
													</div>
												</div>
											)}
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</main>
	);
}
