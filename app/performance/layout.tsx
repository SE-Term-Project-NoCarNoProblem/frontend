import { ReactNode } from "react";
import PerformanceCards from "../components/PerformanceCard";
import Navbar from "../components/NavBar";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-dvh w-screen flex flex-col bg-white">
			<Navbar />
			<PerformanceCards />
			<main>{children}</main>
		</div>
	);
}
