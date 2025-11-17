"use client";

import Image from "next/image";
import React from "react";
import AdminSidebar from "../components/AdminSideBar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen bg-gray-50 text-black">
			{/* Sidebar */}
			<AdminSidebar />

			{/* Main Content */}
			<main className="flex-1">{children}</main>
		</div>
	);
}
