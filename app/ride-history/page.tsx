"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Drop at: app/ride-history/page.tsx
 * Tailwind required. Mobile-first, desktop-friendly.
 * This page is adapted from your Tickets page and redesigned for ride history.
 */

// ---- Types ---------------------------------------------------------------
export type VehicleType = "motorcycle" | "car" | "van";
export type RideStatus = "ongoing" | "completed" | "canceled";
export type EndReason = "completed" | "customer_canceled" | "driver_canceled" | "no_show";

export interface RideItem {
    id: string;
    vehicleType: VehicleType;
    driverName: string;
    vehicle: {
        color: string;
        model: string; // e.g., "Toyota Vios"
        plate: string; // e.g., "1กก-1234"
    };
    pickup: string;
    destination: string;
    priceTHB: number; // THB
    rating: 1 | 2 | 3 | 4 | 5;
    status: RideStatus;
    requestedAt: string; // ISO
    endedAt?: string; // ISO
    endReason?: EndReason;
}

// ---- Mock Data (8 samples) ----------------------------------------------
const MOCK_RIDES: RideItem[] = [
    {
        id: "R-240621-011",
        vehicleType: "motorcycle",
        driverName: "Anucha P.",
        vehicle: { color: "Blue", model: "Honda Click 125i", plate: "7กฬ-1123" },
        pickup: "Chulalongkorn Engineering Building 4",
        destination: "Samyan Mitrtown",
        priceTHB: 48,
        rating: 5,
        status: "completed",
        requestedAt: "2025-06-21T13:05:00Z",
        endedAt: "2025-06-21T13:18:00Z",
        endReason: "completed",
    },
    {
        id: "R-240702-104",
        vehicleType: "car",
        driverName: "Ploy S.",
        vehicle: { color: "White", model: "Toyota Vios", plate: "2ขค-5521" },
        pickup: "Siam Paragon Gate 3",
        destination: "Chula CU Terrace",
        priceTHB: 89,
        rating: 4,
        status: "completed",
        requestedAt: "2025-07-02T10:10:00Z",
        endedAt: "2025-07-02T10:40:00Z",
        endReason: "completed",
    },
    {
        id: "R-240910-077",
        vehicleType: "van",
        driverName: "Kittisak T.",
        vehicle: { color: "Silver", model: "Hyundai H-1", plate: "3ฮย-9007" },
        pickup: "Don Mueang Airport (Terminal 2)",
        destination: "Chula Engineering (Chamchuri 4)",
        priceTHB: 420,
        rating: 5,
        status: "completed",
        requestedAt: "2025-09-10T06:05:00Z",
        endedAt: "2025-09-10T07:02:00Z",
        endReason: "completed",
    },
    {
        id: "R-241020-201",
        vehicleType: "motorcycle",
        driverName: "Nattapong R.",
        vehicle: { color: "Black", model: "Yamaha Aerox", plate: "8กผ-7880" },
        pickup: "BTS National Stadium",
        destination: "MBK Center",
        priceTHB: 33,
        rating: 3,
        status: "canceled",
        requestedAt: "2025-10-20T14:20:00Z",
        endedAt: "2025-10-20T14:27:00Z",
        endReason: "customer_canceled",
    },
    {
        id: "R-241106-314",
        vehicleType: "car",
        driverName: "Warisa K.",
        vehicle: { color: "Red", model: "Mazda 2", plate: "1ฮก-4410" },
        pickup: "Faculty of Science, CU",
        destination: "ICONSIAM",
        priceTHB: 145,
        rating: 4,
        status: "ongoing",
        requestedAt: "2025-11-06T09:30:00Z",
    },
    {
        id: "R-241111-026",
        vehicleType: "van",
        driverName: "Siripong D.",
        vehicle: { color: "White", model: "Toyota Commuter", plate: "ปท-6629" },
        pickup: "Chula Book Center",
        destination: "Suvarnabhumi Airport (BKK)",
        priceTHB: 520,
        rating: 5,
        status: "completed",
        requestedAt: "2025-11-11T03:40:00Z",
        endedAt: "2025-11-11T04:55:00Z",
        endReason: "completed",
    },
    {
        id: "R-241111-082",
        vehicleType: "car",
        driverName: "Peeranan B.",
        vehicle: { color: "Grey", model: "Honda City", plate: "9กข-1432" },
        pickup: "Samyan Mitrtown",
        destination: "Silom Complex",
        priceTHB: 79,
        rating: 2,
        status: "canceled",
        requestedAt: "2025-11-11T15:05:00Z",
        endedAt: "2025-11-11T15:14:00Z",
        endReason: "driver_canceled",
    },
    {
        id: "R-241112-018",
        vehicleType: "motorcycle",
        driverName: "Nina C.",
        vehicle: { color: "Green", model: "Honda Wave 110i", plate: "5กส-2290" },
        pickup: "Chulalongkorn Stadium",
        destination: "Chamchuri Square",
        priceTHB: 28,
        rating: 4,
        status: "completed",
        requestedAt: "2025-11-12T10:21:00Z",
        endedAt: "2025-11-12T10:31:00Z",
        endReason: "completed",
    },
];

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

const clamp2 = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
};

const VEHICLE_ICON: Record<VehicleType, string> = {
    motorcycle: "/icons/motorcycle.svg",
    car: "/icons/car2.svg",
    van: "/icons/van.svg",
};

export default function RideHistoryPage() {
    const router = useRouter();
    const [openId, setOpenId] = useState<string | null>(null);
    const rides = useMemo((): RideItem[] => MOCK_RIDES, []);

    const handleToggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

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

    const Stars = ({ n }: { n: number }) => (
        <div className="flex items-center gap-0.5" aria-label={`${n} out of 5 stars`}>
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
                                                        <span className={statusChip(r.status)}>{r.status}</span>
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
                                                <p className="mt-2 text-sm text-slate-600" style={clamp2}>
                                                    {r.pickup} → {r.destination}
                                                </p>
                                            )}

                                            {/* Expanded Content */}
                                            {expanded && (
                                                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                                    {/* Route & price */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-start gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-[#0E4B5D]" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M12 2v20" />
                                                                <path d="M5 15l7 7 7-7" />
                                                            </svg>

                                                            <div className="min-w-0">
                                                                <div className="truncate font-medium text-slate-900">{r.pickup}</div>
                                                                <div className="truncate text-slate-600">{r.destination}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-[13px] text-slate-700">
                                                            <span className="font-semibold text-slate-800">Price: </span>
                                                            {formatTHB(r.priceTHB)}
                                                        </div>
                                                    </div>

                                                    {/* Vehicle & driver */}
                                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        <div className="text-[13px]">
                                                            <span className="font-semibold text-slate-800">Driver: </span>
                                                            {r.driverName}
                                                        </div>
                                                        <div className="text-[13px]">
                                                            <span className="font-semibold text-slate-800">Vehicle: </span>
                                                            {r.vehicle.color} {r.vehicle.model}
                                                        </div>
                                                        <div className="text-[13px]">
                                                            <span className="font-semibold text-slate-800">Plate: </span>
                                                            {r.vehicle.plate}
                                                        </div>
                                                        <div className="text-[13px] flex items-center gap-2">
                                                            <span className="font-semibold text-slate-800">Rating: </span>
                                                            <Stars n={r.rating} />
                                                        </div>
                                                    </div>

                                                    {/* Status & times */}
                                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        <div className="text-[13px]">
                                                            <span className="font-semibold text-slate-800">Status: </span>
                                                            <span className={statusChip(r.status)}>{r.status}</span>
                                                        </div>
                                                        <div className="text-[13px]">
                                                            <span className="font-semibold text-slate-800">Requested at: </span>
                                                            {formatThai(r.requestedAt)}
                                                        </div>
                                                        {r.endedAt && (
                                                            <div className="text-[13px]">
                                                                <span className="font-semibold text-slate-800">Ended at: </span>
                                                                {formatThai(r.endedAt)}
                                                            </div>
                                                        )}
                                                        {r.endReason && (
                                                            <div className="text-[13px]">
                                                                <span className="font-semibold text-slate-800">End reason: </span>
                                                                {EndReasonText[r.endReason]}
                                                            </div>
                                                        )}
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
