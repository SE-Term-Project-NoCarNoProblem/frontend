import { ReactNode } from "react";
import PerformanceCards from "../components/PerformanceCard";
import Navbar from "../components/NavBar";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
 return (
   <div className="min-h-dvh w-screen flex flex-col bg-white">
     <Navbar />
     {/*<div className="flex flex-row gap-6 mx-6 my-6 h-[30vh]">
       <PerformanceCard status="No Results" number={0} />
       <PerformanceCard status="Try Again" number={0} />
       <PerformanceCard status="Search Tips" number={0} />
       <PerformanceCard status="Help" number={0} />
     </div>*/}
     <PerformanceCards />
     <main >{children}</main>
   </div>
 )
}
