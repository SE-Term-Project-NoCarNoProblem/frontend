import SupportTicketsTable from "../components/SupportTable";

export default function SupportPage() {
	return (
		<div>
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
			<div className="bg-sky-50">
				<SupportTicketsTable />
			</div>
		</div>
	);
}
