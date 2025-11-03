import type { Metadata } from "next";
import Image from "next/image";


export const metadata: Metadata = {
	title: "NoCarNoProblem",
	description: "Carpooling app profile page",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<main className="">{children}</main>
			</body>
		</html>
	);
}
