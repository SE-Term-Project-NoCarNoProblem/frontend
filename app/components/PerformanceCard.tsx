"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/api";

interface PerformanceProps {
	status: string;
	number: number;
	bgColor?: string;
	textColor?: string;
}

function PerformanceCard({
	status,
	number,
	bgColor = "bg-black",
	textColor = "text-white",
}: PerformanceProps) {
	return (
		<div
			className={`${bgColor} rounded-xl p-4 flex flex-col justify-center items-center flex-1`}
		>
			<p
				className={`text-lg md:text-2xl text-center mb-1 font-bold ${textColor}`}
			>
				{status}
			</p>
			<h2 className={`text-5xl md:text-8xl text-center font-bold ${textColor}`}>
				{number}
			</h2>
		</div>
	);
}

export default function PerformanceCards() {
	const [bannedCustomer, setBannedCustomer] = useState(0);
	const [bannedDriver, setBannedDriver] = useState(0);
	const [suspendedCustomer, setSuspendedCustomer] = useState(0);
	const [suspendedDriver, setSuspendedDriver] = useState(0);

	const fetchStats = async () => {
		try {
			const response = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/stats/`
			);
			if (response.ok) {
				const result = await response.json();
				const data = result.data;
				setBannedCustomer(data.bannedCustomers);
				setBannedDriver(data.bannedDrivers);
				setSuspendedCustomer(data.suspendedCustomers);
				setSuspendedDriver(data.suspendedDrivers);
			}
		} catch (error) {
			console.error("Failed to fetch admin stats:", error);
		}
	};

	useEffect(() => {
		fetchStats();

		const interval = setInterval(
			() => {
				fetchStats();
			},
			10 * 60 * 1000
		);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex md:flex-row flex-col gap-6 mx-6 my-6 md:h-[30vh] h-vh">
			<div className="flex flex-1 flex-row gap-6">
				<PerformanceCard
					status="Banned Cusomter"
					number={bannedCustomer}
					textColor="text-[#A22E2D]"
					bgColor="bg-[#FFDADA]"
				/>
				<PerformanceCard
					status="Banned Driver"
					number={bannedDriver}
					textColor="text-[#A22E2D]"
					bgColor="bg-[#FFDADA]"
				/>
			</div>
			<div className="flex flex-row flex-1 gap-6">
				<PerformanceCard
					status="Suspended Customer"
					number={suspendedCustomer}
					textColor="text-[#D2B813]"
					bgColor="bg-[#FFFBCA]"
				/>
				<PerformanceCard
					status="Suspended Driver"
					number={suspendedDriver}
					textColor="text-[#D2B813]"
					bgColor="bg-[#FFFBCA]"
				/>
			</div>
		</div>
	);
}
