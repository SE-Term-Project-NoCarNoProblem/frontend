import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Driver En Route - Ride Tracking",
	description: "Track your driver's location and ride progress in real-time",
};

export default function DriverEnRouteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
