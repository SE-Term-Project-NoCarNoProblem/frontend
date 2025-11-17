"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarItemProps {
	label: string;
	page: string;
	isActive: boolean;
	onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	label,
	page,
	isActive,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			className={`flex items-center space-x-3 px-6 py-4 cursor-pointer transition-all duration-200
      ${isActive ? "bg-[#0E4663] text-white" : "text-[#0E4663] hover:bg-blue-50"}`}
		>
			<img
				src={` ${isActive ? `/icons-admin/${page}-w.svg` : `/icons-admin/${page}.svg`} `}
				alt={`${page}`}
			/>
			<span className="font-medium text-sm">{label}</span>
		</div>
	);
};

const SidebarLogo: React.FC = () => (
	<div className="flex flex-col items-center py-8 w-full overflow-hidden">
		<div className="flex flex-row items-center w-full px-3">
			<img src={`/icons-admin/car.svg`} alt="car.svg" />
			<div className="flex flex-col mx-2 text-center">
				<span className="text-base sm:text-lg font-bold text-[#0E4663]">
					NoCarNoProblem
				</span>
				<span className="text-[10px] sm:text-xs text-gray-400">
					Admin Dashboard
				</span>
			</div>
		</div>
	</div>
);

const AdminSidebar: React.FC = () => {
	const router = useRouter();
	const pathname = usePathname();

	const handleClick = (page: string) => {
		router.push(`/dashboard/${page}`);
	};

	const isActive = (page: string) => {
		return pathname?.includes(`/dashboard/${page}`);
	};

	return (
		<div className="h-screen w-64 bg-white shadow-md flex flex-col">
			<SidebarLogo />
			<div className="flex-1 flex flex-col">
				<SidebarItem
					label="Driver Approvals"
					page="driver-approval"
					isActive={isActive("driver-approval")}
					onClick={() => handleClick("driver-approval")}
				/>
				<SidebarItem
					label="Driver Performance"
					page="driver-performance"
					isActive={isActive("driver-performance")}
					onClick={() => handleClick("driver-performance")}
				/>
				<SidebarItem
					label="Account Management"
					page="account-management"
					isActive={isActive("account-management")}
					onClick={() => handleClick("account-management")}
				/>
				<SidebarItem
					label="Support Tickets"
					page="support-tickets"
					isActive={isActive("support-tickets")}
					onClick={() => handleClick("support-tickets")}
				/>
			</div>
		</div>
	);
};

export default AdminSidebar;
