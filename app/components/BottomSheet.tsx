"use client";
import { useState } from "react";

export default function BottomSheet({
	onRequestRide,
}: {
	onRequestRide: () => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className=" fixed z-2000 inset-x-0 bottom-0 pointer-events-auto">
			<div className="mx-auto max-w-3xl">
				<div
					className={`bg-white rounded-t-2xl shadow-xl transition-[height] duration-300 ease-in-out 
        overflow-hidden ${open ? "h-[55vh]" : "h-14"}`}
				>
					{/* header(click to snap) */}
					<div
						className="flex items-center justify-center p-3 cursor-pointer select-none"
						onClick={() => setOpen((v) => !v)}
					>
						<div className="w-10 h-1 rounded-full bg-gray-300 absolute top-4"></div>
						<div className="text-lg font-semibold pt-4 text-blue-900">
							Choose a ride
						</div>
					</div>

					{/* when snap open */}
					<div className={`p-4 ${open ? "block" : "hidden"}`}>
						<div className="space-y-3">
							<div className="flex items-center justify-between border border-blue-900 p-3 rounded-xl">
								<div className="flex items-center gap-3">
									<span className="text-2xl">🚗</span>
									<div>
										<div className="font-medium text-blue-900">Car ride</div>
										<div className="text-sm text-blue-900">x people</div>
									</div>
								</div>
								<div className="text-lg font-semibold text-blue-900">$20</div>
							</div>

							<button
								className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-indigo-500 hover:shadow-lg"
								onClick={onRequestRide}
							>
								Request a ride
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
