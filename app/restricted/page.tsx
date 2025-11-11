"use client";
import NavBar from "../components/NavBar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Restricted() {
	const router = useRouter();

	return (
		<section className="min-h-dvh bg-white">
			<NavBar />
			<div className="text-black flex flex-col items-center justify-center mt-20 gap-8 border-2 w-[300px] lg:w-[400px] m-auto border-gray-100 py-8 px-4 rounded-xl shadow-md">
				<div className="text-lg font-bold"> Access Restricted</div>
				<Image
					src="/restricted_access.svg"
					alt="restricted access"
					width={150}
					height={150}
				/>
				<div className="text-center">
					Your driver status is not approved. <br /> You cannot access this
					page.
				</div>
				<button
					onClick={() => router.back()}
					className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer shadow-xl"
				>
					<div className="flex px-20 py-2">
						<p className="flex items-center text-[#F8F8F8]">Back</p>
					</div>
				</button>
			</div>
		</section>
	);
}
