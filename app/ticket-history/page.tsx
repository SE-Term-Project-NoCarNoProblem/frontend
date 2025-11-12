"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// ---- Types ---------------------------------------------------------------
export type TicketStatus = "resolved" | "open";

export interface TicketItem {
    id: string;
    title: string;
    createdAt: string; // ISO (ticket created)
    status: TicketStatus;
    details: string;
    resolvedAt?: string; // ISO (only when resolved)
    // New ride-related fields
    rideStartAt?: string; // ISO
    rideEndAt?: string; // ISO
    pickup?: string;
    destination?: string;
}

// ---- Mock Data (5 samples, mix of statuses) ------------------------------
const MOCK_TICKETS: TicketItem[] = [
    {
        id: "T-100021",
        title: "Incorrect Route",
        createdAt: "2025-06-10T11:30:00Z",
        status: "resolved",
        resolvedAt: "2025-06-11T03:15:00Z",
        details:
            "The driver ignored the suggested GPS route and took multiple unnecessary detours.",
        pickup: "Chulalongkorn Engineering Building 4",
        destination: "Samyan Mitrtown",
        rideStartAt: "2025-06-10T11:05:00Z",
        rideEndAt: "2025-06-10T11:25:00Z",
    },
    {
        id: "T-100022",
        title: "Driver Arrived Late",
        createdAt: "2025-06-12T09:05:00Z",
        status: "open",
        details:
            "Driver arrived 20 minutes past the ETA without any communication.",
        pickup: "Siam Paragon Gate 3",
        destination: "CU Terrace",
        rideStartAt: "2025-06-12T09:30:00Z",
        rideEndAt: "2025-06-12T10:00:00Z",
    },
    {
        id: "T-100023",
        title: "Vehicle Cleanliness",
        createdAt: "2025-06-14T14:20:00Z",
        status: "resolved",
        resolvedAt: "2025-06-15T01:42:00Z",
        details: "Seat stains and noticeable odor inside the car.",
        pickup: "Don Mueang Airport T2",
        destination: "Chula Engineering (Chamchuri 4)",
        rideStartAt: "2025-06-14T13:58:00Z",
        rideEndAt: "2025-06-14T14:55:00Z",
    },
    {
        id: "T-100024",
        title: "Unsafe Driving",
        createdAt: "2025-06-18T02:40:00Z",
        status: "open",
        details:
            "Abrupt lane changes and speeding reported by the passenger.",
        pickup: "BTS National Stadium",
        destination: "MBK Center",
        rideStartAt: "2025-06-18T02:10:00Z",
        rideEndAt: "2025-06-18T02:28:00Z",
    },
    {
        id: "T-100025",
        title: "Incorrect Fare Charged",
        createdAt: "2025-06-19T16:10:00Z",
        status: "resolved",
        resolvedAt: "2025-06-20T05:00:00Z",
        details:
            "Final fare exceeded estimate despite no extra stops or incidents.",
        pickup: "Chula Book Center",
        destination: "Silom Complex",
        rideStartAt: "2025-06-19T15:42:00Z",
        rideEndAt: "2025-06-19T16:08:00Z",
    },
];

// ---- Helpers -------------------------------------------------------------
function formatThai(dtIso?: string) {
    if (!dtIso) return "—";
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

function formatThaiTime(dtIso?: string) {
    if (!dtIso) return "—";
    try {
        const d = new Date(dtIso);
        return new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Bangkok",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(d);
    } catch {
        return dtIso!;
    }
}

function rideDuration(startIso?: string, endIso?: string) {
    if (!startIso || !endIso) return null;
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return null;
    const mins = Math.round((end - start) / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const clamp2 = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
};

export default function TicketsHistoryPage() {
    const router = useRouter();
    const [openId, setOpenId] = useState<string | null>(null);
    const tickets = useMemo(() => MOCK_TICKETS, []);

    const handleToggle = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id)); // accordion (one at a time)
    };

    const onIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        // Fallback to simple inline SVGs (ticket & chevron)
        const img = e.currentTarget;
        const kind = img.dataset.kind;
        const svgTicket =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230E4B5D" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0-2 2 2 2 0 0 0 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 2-2 2 2 0 0 0-2-2V7z"/></svg>'
            );
        const svgChevron =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230E4B5D" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>'
            );
        img.src = kind === "dropdown" ? svgChevron : svgTicket;
    };

    const chipClass = (status: TicketStatus) =>
        `px-2 py-1 rounded-full text-xs font-semibold ${status === "resolved"
            ? "bg-green-100 text-green-800"
            : "bg-amber-100 text-amber-800"
        }`;

    return (
        <main className="min-h-dvh bg-white text-slate-800">
            {/* Top bar */}
            <div className="sticky top-0 z-10 w-full bg-[#0E4B5D] text-white">
                <div className="mx-auto flex h-14 max-w-screen-sm items-center gap-3 px-3 sm:px-4">
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={() => router.back()}
                        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 active:bg.white/20"
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
                    <h1 className="text-xl font-semibold tracking-tight">Filed Tickets</h1>
                </div>
            </div>

            {/* List */}
            <div className="mx-auto max-w-screen-sm px-3 pb-10 sm:px-4">
                <div className="bg-white px-3 sm:px-4">
                    <ul className="divide-y divide-slate-200">
                        {tickets.map((t) => {
                            const expanded = openId === t.id;
                            const start = formatThaiTime(t.rideStartAt);
                            const end = formatThaiTime(t.rideEndAt);
                            const dur = rideDuration(t.rideStartAt, t.rideEndAt);

                            return (
                                <li key={t.id} className="py-4">
                                    {/* Row */}
                                    <div className="flex items-start gap-3">
                                        <img
                                            src="/icons/ticket.svg"
                                            alt="ticket"
                                            width={24}
                                            height={24}
                                            data-kind="ticket"
                                            onError={onIconError}
                                            className="h-6 w-6 shrink-0"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="truncate text-[15px] font-semibold text-slate-900">
                                                            {t.title}
                                                        </h3>
                                                        <span className={chipClass(t.status)}>{t.status}</span>
                                                    </div>
                                                    <div className="mt-0.5 text-xs font-semibold text-slate-700">
                                                        Ticket filed • {formatThai(t.createdAt)}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleToggle(t.id)}
                                                    aria-expanded={expanded}
                                                    className={`-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#0E4B5D] hover:bg-slate-100 active:bg-slate-200 ${expanded ? "rotate-180" : ""
                                                        } transition-transform`}
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

                                            {/* Collapsed snippet: 2 tidy lines */}
                                            {!expanded && (
                                                <div className="mt-2 space-y-1 text-sm">
                                                    <p className="text-slate-900" style={clamp2}>
                                                        {t.pickup || "—"} → {t.destination || "—"}
                                                    </p>
                                                    <p className="text-slate-600">
                                                        Ride time: <span className="font-medium text-slate-700">{start}</span>
                                                        {" – "}
                                                        <span className="font-medium text-slate-700">{end}</span>
                                                        {dur ? ` (${dur})` : ""}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Expanded Content */}
                                            {expanded && (
                                                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        <div>
                                                            <span className="font-semibold text-slate-800">Pickup: </span>
                                                            <span className="whitespace-pre-line">{t.pickup || "—"}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-800">Destination: </span>
                                                            <span className="whitespace-pre-line">{t.destination || "—"}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-800">Ride time: </span>
                                                            <span className="text-slate-800">
                                                                {start} – {end}
                                                            </span>
                                                            {dur && <span className="text-slate-500"> ({dur})</span>}
                                                        </div>
                                                        {t.status === "resolved" && t.resolvedAt && (
                                                            <div>
                                                                <span className="font-semibold text-slate-800">Resolved at: </span>
                                                                {formatThai(t.resolvedAt)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-3">
                                                        <span className="font-semibold text-slate-800">Details: </span>
                                                        <span className="whitespace-pre-line">{t.details}</span>
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
