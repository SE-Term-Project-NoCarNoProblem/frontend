
import type { Metadata } from "next";
import Image from "next/image";
import "../globals.css";

export const metadata: Metadata = {
  title: "NoCarNoProblem",
  description: "Carpooling app registration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <nav className="bg-[#D9D9D9] px-6 py-3 flex items-center shadow-sm">
          <span className="flex items-center text-lg font-semibold text-[#0E4663]">
            <span className="mr-2">
                          <Image
                            aria-hidden
                            src="/directions_car.svg"
                            alt="car icon"
                            width={24}
                            height={24}
                          />
            </span> NoCarNoProblem
          </span>
        </nav>
        {/* Page content */}
        <main className="">{children}</main>
      </body>
    </html>
  );
}