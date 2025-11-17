"use client";

import DriverApprovalCard from "../../components/DriverApprovalCard";
import { useEffect, useState } from "react";

interface Driver {
	driverId: string;
	driverProfile: string;
	idPic: string;
	licensePic: string;
}

export default function DriverApprovals() {
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

	async function fetchDrivers() {
		const token = localStorage.getItem("token");

		const res = await fetch(`${backend}/admin/drivers/waiting`, {
			headers: {
				authorization: `${token}`,
			},
		});

		if (!res.ok) {
			console.error("Failed to fetch drivers");
			return;
		}

		const data = await res.json();

		// Transform shape if needed
		const mapped = data.map((d: any) => ({
			driverId: d.id,
			driverProfile: `/driver-profile-customer-view/${d.id}`,
			idPic: d.driver?.user?.id_pic || "",
			licensePic: d.driver?.license_pic || "",
		}));

		setDrivers(mapped);
	}

	useEffect(() => {
		fetchDrivers();
	}, []);

	const handleApprove = async (driverId: string) => {
		const token = localStorage.getItem("token");

		const res = await fetch(`${backend}/admin/drivers/${driverId}/approve`, {
			method: "POST",
			headers: {
				authorization: `${token}`,
			},
		});

		if (!res.ok) {
			alert("Approve failed");
			return;
		}

		setDrivers((prev) => prev.filter((d) => d.driverId !== driverId));
		alert(`Driver approved`);
	};

	const handleReject = async (driverId: string) => {
		const token = localStorage.getItem("token");

		const res = await fetch(`${backend}/api/admin/drivers/${driverId}/reject`, {
			method: "POST",
			headers: {
				authorization: `${token}`,
			},
		});

		if (!res.ok) {
			alert("Reject failed");
			return;
		}

		setDrivers((prev) => prev.filter((d) => d.driverId !== driverId));
		alert(`Driver rejected`);
	};

	return (
		<div className="p-6 bg-white min-h-screen flex">
			<div className="flex-1">
				<div className="text-[20px] text-lg font-semibold flex items-center gap-2 mb-4 text-[#0E4663]">
					<span>
						<img src={"../../stash_person-duotone.svg"} alt="human logo" />
					</span>
					Driver Approvals
				</div>

				<hr className="border border-gray-200 my-4" />

				<div className="h-170 overflow-y-scroll">
					{drivers.length === 0 ? (
						<div className="text-lg font-semibold flex items-center gap-2 mb-4 text-[#0E4663]">
							✅ All drivers have been considered
						</div>
					) : (
						drivers.map((driver: any) => (
							<DriverApprovalCard
								key={driver.driverId}
								driverId={driver.driverId}
								driverProfile={driver.driverProfile}
								idPic={driver.idPic}
								licensePic={driver.licensePic}
								onApprove={() => handleApprove(driver.driverId)}
								onReject={() => handleReject(driver.driverId)}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
