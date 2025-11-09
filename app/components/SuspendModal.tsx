"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

export interface SuspendModalProps {
	userStatus: "suspended" | "banned" | "active";
	suspendedTime?: number;
}

interface Theme {
	icon: string;
	heading: string;
	subheading: string;
	body: string;
}

function formatHoursMinutes(ms: number) {
	if (ms < 0) ms = 0;
	const totalMinutes = Math.floor(ms / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} min`;
}

export const SuspendModal: React.FC<SuspendModalProps> = ({
	userStatus,
	suspendedTime,
}) => {
	const [remain, setRemain] = useState(suspendedTime || 0);
	const [theme, setTheme] = useState<Theme>({
		icon: "",
		heading: "",
		subheading: "",
		body: "",
	});
	const dialogRef = React.useRef<HTMLDivElement>(null);
	// console.log("SuspendModal userStatus:", userStatus);

	useEffect(() => {
		// console.log("useEffect");
		// if (userStatus === "active") return;
		if (userStatus == "suspended" || userStatus == "banned") {
			//prevent scrolling
			// document.body.style.overflow = 'hidden';
		}
		switch (userStatus) {
			case "suspended":
				setTheme({
					icon: "/caution_yellow.svg",
					heading: formatHoursMinutes(remain),
					subheading: "Your account has been paused",
					body: "Your account has been temporarily suspended as you failed to maintain your cancellation rate below 25% requirement.",
				});
				break;

			case "banned":
				setTheme({
					icon: "/caution_red.svg",
					heading: "Account Banned",
					subheading: "Your account has been banned",
					body: "After our discussions, your account has been permanently banned due to violate(s) of the code of conduct.",
				});
				break;
		}
		const interval = setInterval(() => {
			setRemain((prev) => (prev > 0 ? prev - 60000 : 0));
		}, 60000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		console.log(remain);
		setTheme((prevTheme) => {
			if (userStatus === "suspended") {
				return {
					...prevTheme,
					heading: formatHoursMinutes(remain),
				};
			}
			return prevTheme;
		});
	}, [remain]);

	useEffect(() => {
		if (userStatus === "suspended" || userStatus === "banned") {
			const prevOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";

			// move focus into the dialog
			const el = dialogRef.current;
			el?.focus();

			return () => {
				document.body.style.overflow = prevOverflow;
			};
		}
	}, [userStatus]);

	return (
		// <div
		//   aria-hidden
		//   // className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
		//   // onClick={() => {
		//   //   if (!blocking) onClose?.();
		//   // }}
		// >
		<div
			// aria-hidden
			className="absolute inset-0 flex items-center justify-center z-999  bg-black/40"
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="account-status-title"
				aria-describedby="account-status-desc"
				tabIndex={-1}
				className="mx-4 w-full max-w-xl rounded-2xl bg-white shadow-xl outline-none"
				ref={dialogRef}
				// onClick={(e) => e.stopPropagation()}
			>
				<div className="p-6 sm:p-8">
					<div
						className={`mx-auto mb-4 grid h-32 w-32 place-items-center rounded-full`}
					>
						<Image
							src={theme.icon}
							alt="caution red"
							width={200}
							height={200}
						/>
					</div>

					<h2
						id="account-status-title"
						className="text-center text-2xl font-extrabold  text-[#0E4663]"
					>
						{theme.heading}
					</h2>
					<p className="mt-1 text-center text-lg font-semibold  text-[#0E4663]">
						{theme.subheading}
					</p>
					<div
						id="account-status-desc"
						className="mt-3 text-base leading-7  text-[#0E4663]"
					>
						{theme.body}
					</div>

					<div className="mt-6 flex justify-center">
						<button
							type="button"
							// onClick={onHelp}
							className="inline-flex items-center rounded-full px-5 py-2.5 text-base font-semibold text-white bg-[#0E4663]  hover:bg-[#0E4663]/90 hover:cursor-pointer  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
						>
							Help Center
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuspendModal;
