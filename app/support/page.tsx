"use client";
import React from "react";

// --- Mock Data ---------------------------------------------------------------

type TicketStatus = "open" | "resolved";
type RideStatus = "ongoing" | "completed" | "canceled";

interface RideInfo {
    pickup: string;
    destination: string;
    price: number;
    vehicle: { color: string; model: string; plate: string };
    startAt: string;
    endAt: string | null;
    status: RideStatus;
    endReason?: string;
    rating?: number; // Add ride rating (1-5)
}

interface SupportTicket {
    id: string;
    from: {
        name: string;
        role: "customer" | "rider";
    };
    ride: {
        id: string;
    };
    topic: string;
    status: TicketStatus;
    createdAt: string;
}

const TICKETS: SupportTicket[] = [
    {
        id: "T-92457fasdfsadfasd1",
        from: { name: "Ploy Somkiafasdfadsfsadfasdfadsfasdfadsftfsadfsadfdsafdsafdsa", role: "customer" },
        ride: { id: "R-100238afdsfasdfased" },
        topic: "Driver missed pickup pointfadsfdsafasdfasdfads",
        status: "open",
        createdAt: "2025-11-08T09:13:00Z",
    },
    {
        id: "T-924429",
        from: { name: "Arthit Kulwinit", role: "rider" },
        ride: { id: "R-100120" },
        topic: "App crashed during navigation",
        status: "open",
        createdAt: "2025-11-08T08:02:00Z",
    },
    {
        id: "T-924301",
        from: { name: "Mint Arnut", role: "customer" },
        ride: { id: "R-099928" },
        topic: "Overcharge dispute (toll)",
        status: "resolved",
        createdAt: "2025-11-08T06:47:00Z",
    },
    {
        id: "T-924188",
        from: { name: "Somchai Prapakpong", role: "customer" },
        ride: { id: "R-099771" },
        topic: "Lost item: wallet",
        status: "open",
        createdAt: "2025-11-08T05:10:00Z",
    },
    {
        id: "T-924070",
        from: { name: "Kanya Chitawan", role: "rider" },
        ride: { id: "R-099632" },
        topic: "Unfair rating appeal",
        status: "open",
        createdAt: "2025-11-08T03:39:00Z",
    },

];

const RIDES: Record<string, RideInfo> = {
    "R-100238afdsfasdfased": {
        pickup: "Siam Paragon Gate 1",
        destination: "Chulalongkorn Universityfasfdasfasddfsfadsfsfdsafdassadfasfsdsdafsafas",
        price: 125.5,
        vehicle: { color: "Black", model: "Toyota Corolla", plate: "1กข-1234" },
        startAt: "2025-11-08T09:00:00Z",
        endAt: "2025-11-08T09:35:00Z",
        status: "completed",
        endReason: "Arrived",
        rating: 4
    },
    "R-100120": {
        pickup: "EmQuartier",
        destination: "Bang Kapi",
        price: 210,
        vehicle: { color: "White", model: "Honda City", plate: "4ขค-7788" },
        startAt: "2025-11-08T07:45:00Z",
        endAt: null,
        status: "ongoing",
        endReason: "Arrived",
        rating: 5
    },
    "R-099928": {
        pickup: "Don Mueang Airport",
        destination: "Victory Monument",
        price: 180,
        vehicle: { color: "Blue", model: "Mazda 2", plate: "7ทว-4455" },
        startAt: "2025-11-08T06:15:00Z",
        endAt: "2025-11-08T06:50:00Z",
        status: "completed",
        endReason: "Arrived",
        rating: 3
    },
    "R-099771": {
        pickup: "MBK Center",
        destination: "Asok BTS",
        price: 95,
        vehicle: { color: "Red", model: "Nissan Almera", plate: "2ฮล-2244" },
        startAt: "2025-11-08T05:00:00Z",
        endAt: "2025-11-08T05:25:00Z",
        status: "completed",
        endReason: "Arrived",
        rating: 5
    },
    "R-099632": {
        pickup: "IconSiam",
        destination: "Samyan Mitrtown",
        price: 130,
        vehicle: { color: "Silver", model: "Toyota Vios", plate: "9ญย-9900" },
        startAt: "2025-11-08T03:10:00Z",
        endAt: "2025-11-08T03:40:00Z",
        status: "completed",
        endReason: "Arrived",
        rating: 2
    }
};

const thb = new Intl.NumberFormat(undefined, { style: "currency", currency: "THB" });

function formatDateTime(iso?: string | null) {
    if (!iso) return "-";
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short"
        });
    } catch {
        return iso ?? "-";
    }
}


// --- Helpers -----------------------------------------------------------------

function formatTime(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
        });
    } catch {
        return iso;
    }
}

function StatusBadge({ status }: { status: TicketStatus }) {
    const map: Record<TicketStatus, string> = {
        open: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        resolved: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    };
    const label: Record<TicketStatus, string> = {
        open: "Open",
        resolved: "Resolved",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}>
            {label[status]}
        </span>
    );
}

function RolePill({ role }: { role: "customer" | "rider" }) {
    const cls =
        role === "customer"
            ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
            : "bg-rose-50 text-rose-700 ring-rose-200";
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${cls}`}>
            {role}
        </span>
    );
}

// Helper for rendering stars
function renderStars(rating?: number) {
    if (!rating) return "-";
    return (
        <span className="text-yellow-400 text-base" aria-label={`${rating} stars`}>
            {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </span>
    );
}

// --- Page --------------------------------------------------------------------

export default function SupportTicketsPage() {
    const [openId, setOpenId] = React.useState<string | null>(null);
    const [tickets, setTickets] = React.useState(TICKETS);
    const [filter, setFilter] = React.useState<"all" | "open">("all");

    // Filter tickets if needed
    const filteredTickets = filter === "open"
        ? tickets.filter(t => t.status === "open")
        : tickets;

    // Only allow toggling between "open" and "resolved"
    const nextStatus: Record<TicketStatus, TicketStatus> = {
        open: "resolved",
        resolved: "open"
    };

    function toggleTicketStatus(id: string) {
        setTickets(prev =>
            prev.map(t => (t.id === id ? { ...t, status: nextStatus[t.status] } : t))
        );
    }

    return (
        <div className="min-h-screen bg-sky-50/99">
            {/* Top bar - White background */}
            <header className="w-full bg-white shadow-sm relative">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center">

                    {/* Centered Support Tickets */}
                    <div className="flex items-center gap-2 my-3">
                        <img src="/icons/ticket.svg" className="h-8 w-8" />
                        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
                            Support Tickets
                        </h1>
                    </div>
                </div>

                {/* Right-aligned brand outside the max-width container */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                        <span className="font-bold">🚙</span>
                    </div>
                    <div className="leading-tight">
                        <div className="text-slate-800 font-semibold">NoCarNoProblem</div>
                        <div className="text-xs text-slate-500">Support Dashboard</div>
                    </div>
                </div>
            </header>


            {/* Filter dropdown above table (left side, styled like image) */}
            <div className="mx-auto max-w-6xl px-6 pt-6 pb-2 flex justify-start">
                <div className="relative">
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value as "all" | "open")}
                        className="appearance-none px-4 py-2 pr-8 rounded-md border border-slate-300 bg-white text-slate-600 font-semibold text-sm focus:outline-none" // removed focus:ring, changed rounded to rounded-md
                        style={{ minWidth: 170 }}
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open Tickets Only</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        ▼
                    </span>
                </div>
            </div>

            {/* Table card - Light blue background section */}
            <main className="mx-auto max-w-6xl px-6 pt-0 pb-10">
                <div className="w-full overflow-x-auto">
                    <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-sky-100 bg-sky-100/70 mt-7">
                        {/* table header visual */}
                        <div className="bg-sky-800/15 block min-w-[300px]">
                            <div className="grid grid-cols-[150px_250px_100px_100px_1fr_70px_13px] gap-2 px-6 py-3 text-sm font-semibold text-slate-700">
                                <div>time</div>
                                <div>from</div>
                                <div>id</div>
                                <div>ride</div>
                                <div>topic</div>
                                <div>status</div>
                                <div></div>
                            </div>
                            <div className="h-px bg-sky-800/10" />
                        </div>

                        {/* rows */}
                        <ul className="divide-y divide-sky-800/10 bg-sky-900/4 block min-w-[300px] overflow-x-auto">
                            {filteredTickets.map((t) => (
                                <React.Fragment key={t.id}>
                                    {/* Row */}
                                    <li
                                        className="grid grid-cols-[150px_250px_100px_100px_1fr_70px_13px] gap-2 px-6 py-3 text-sm text-slate-800 cursor-pointer transition-colors duration-200 hover:bg-white/30"
                                        onClick={() => setOpenId(openId === t.id ? null : t.id)}
                                    >
                                        <div className="truncate tabular-nums text-slate-700">{formatTime(t.createdAt)}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{t.from.name}</span>
                                            <RolePill role={t.from.role} />
                                        </div>
                                        <div className="truncate text-slate-700">{t.id}</div>
                                        <div className="truncate text-slate-700">{t.ride.id}</div>
                                        <div className="truncate" title={t.topic}>{t.topic}</div>
                                        <div><StatusBadge status={t.status} /></div>
                                    </li>

                                    {/* Expanded details under the row */}
                                    {openId === t.id && (
                                        <li className="px-6 py-4 bg-white/70 text-sm">
                                            {(() => {
                                                const ride = RIDES[t.ride.id];
                                                return (
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        {/* Ticket basics (left column) */}
                                                        <div className="space-y-2">
                                                            <div className="text-slate-600">Ticket ID</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">{t.id}</div>

                                                            <div className="text-slate-600 mt-3">Ticket created by</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">{t.from.name} ({t.from.role})</div>

                                                            <div className="text-slate-600 mt-3">Ticket created at</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">{formatDateTime(t.createdAt)}</div>

                                                            {/* Move Vehicle here */}
                                                            <div className="text-slate-600 mt-3">Vehicle</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">
                                                                {ride ? `${ride.vehicle.color} ${ride.vehicle.model} • ${ride.vehicle.plate}` : "-"}
                                                            </div>

                                                            <div className="text-slate-600 mt-3">Ride rating</div>
                                                            <div className="mt-1">{renderStars(ride?.rating)}</div>
                                                        </div>

                                                        {/* Ride info (middle column, minus Vehicle) */}
                                                        <div className="space-y-2">
                                                            <div className="text-slate-600">Ride ID</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">{t.ride.id}</div>

                                                            <div className="text-slate-600 mt-3">Pickup → Destination</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">
                                                                {ride?.pickup ?? "-"} → {ride?.destination ?? "-"}
                                                            </div>

                                                            <div className="text-slate-600 mt-3">Price</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">{ride ? thb.format(ride.price) : "-"}</div>
                                                        </div>

                                                        {/* Ride timing & status (right column) */}
                                                        <div className="space-y-2">
                                                            <div className="text-slate-600">Time of ride</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">
                                                                {ride ? `${formatDateTime(ride.startAt)} → ${formatDateTime(ride.endAt)}` : "-"}
                                                            </div>

                                                            <div className="text-slate-600 mt-3">Ride status</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line capitalize">{ride?.status ?? "-"}</div>

                                                            <div className="text-slate-600 mt-3">Ride end reason</div>
                                                            <div className="mt-1 text-slate-500 break-words whitespace-pre-line">{ride?.endReason ?? "-"}</div>
                                                        </div>

                                                        {/* Ticket textual details: topic and detail stacked in left column */}
                                                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-1 gap-6 pt-2">
                                                            <div>
                                                                <div className="text-slate-600">Ticket topic</div>
                                                                <div className="mt-1 text-slate-500">{t.topic}</div>
                                                                <div className="text-slate-600 mt-3">Ticket detail</div>
                                                                <div className="mt-1 text-slate-500 break-words whitespace-pre-line">
                                                                    {/* You can wire real data later; placeholder for now */}
                                                                    {`Customer reports: "${t.topic}". Please verify fare and route. Add internal notes here.`}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Resolved info (only if resolved) */}
                                                        {t.status === "resolved" && (
                                                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div>
                                                                    <div className="text-slate-600">Resolved at</div>
                                                                    <div className="mt-1 text-slate-500">{formatDateTime(ride?.endAt)}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-slate-600">Resolved by</div>
                                                                    <div className="mt-1 text-slate-500">Agent NCP-042 (placeholder)</div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Actions */}
                                                        <div className="lg:col-span-3 mt-2 flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => toggleTicketStatus(t.id)}
                                                                className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                                                                title="Cycle status: open → resolved → closed → open"
                                                            >
                                                                Toggle Status (now: {t.status})
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </li>

                                    )}
                                </React.Fragment>
                            ))}

                            {filteredTickets.length === 0 && (
                                <li className="px-6 py-14 text-center flex flex-col items-center justify-center gap-4">
                                    <img src="/icons/no-results.svg" alt="No tickets" className="w-20 h-20 mb-2 opacity-70" />
                                    <div className="text-lg font-semibold text-slate-500">No tickets found</div>
                                    <div className="text-slate-400 text-sm">There are currently no support tickets to display.</div>
                                </li>
                            )}
                        </ul>

                    </div>
                </div>
            </main>
        </div>
    );
}
