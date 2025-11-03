"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LoginNavBar from "../components/LoginNavBar";
import Link from "next/link";

interface Profile {
	id: string;
	fullname: string;
	email: string;
	phone_number: string;
	profile_pic: string;

	age?: number | null;
	role?: string | null;
	home?: string | null;
	favouriteLocation?: string | null;
}

function ProfileContent() {
	// const themeColor1 = "#0E4663";
	// const themeColor2 = "#F8F8F8";
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<Profile | null>(null);

	useEffect(() => {
		async function fetchProfile() {
			try {
				const customerId =
					searchParams.get("customerId") ||
					"5ed29ee2-3286-484e-b7a6-fe8830dd20d9";
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${customerId}`
				);
				const data = await res.json();
				setProfile(data.data);
				console.log("Customer profile data:", data.data);
			} catch (err) {
				console.error("Error fetching profile:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, [searchParams]);

	if (loading) {
		return (
			<div className="p-12 text-xl text-[#0E4663] bg-[#F8F8F8] flex w-full justify-center">
				Loading...
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="p-12 text-xl text-[#0E4663] bg-[#F8F8F8] flex w-full justify-center">
				No profile data
			</div>
		);
	}

  return (
    <>
      {/* <LoginNavBar /> */}
      <div className="bg-white p-12 flex flex-col items-center text-[#000000] mt-0">
        {/* -------------------- Top -------------------- */}
        <div
          className={`w-full max-w-5xl bg-[#0E4663] rounded-2xl shadow-md p-8 border-r-gray-400`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* -------------------- text above profile pic. -------------------- */}
            <div
              className={`w-full text-2xl font-semibold flex justify-between items-center text-[#F8F8F8]`}
            >
              <button
                onClick={() => router.push("/")}
                className="hover:cursor-pointer hover:opacity-70"
              >
                <Image
                  alt="arrow icon"
                  src="/icons/left-arrow-svgrepo-com.svg"
                  width={50}
                  height={50}
                />
              </button>
              <div> Profile </div>
              <button
                onClick={() => router.push("/")}
                className="hover:cursor-pointer hover:opacity-70 invisible"
              >
                <Image
                  alt="arrow icon"
                  src="/icons/left-arrow-svgrepo-com.svg"
                  width={50}
                  height={50}
                />
              </button>
            </div>

						{/* -------------------- Profile Picture -------------------- */}
						<div className="flex rounded-full bg-white w-32 h-32 items-center justify-center border-4 border-gray-300">
							<Image
								alt="Profile Picture"
								src={`./globe.svg`}
								width={120}
								height={120}
								className="rounded-full"
							/>
						</div>

						{/* -------------------- text under pic. -------------------- */}
						<div className="text-2xl font-semibold text-[#F8F8F8]">
							{" "}
							{profile.fullname} {/* รอใส่ตัวแปร */}{" "}
						</div>
						<div className="flex flex-col items-center text-[#F8F8F8]">
							Age: {profile.age || "20"}
							<br />
						</div>
						<div className="flex flex-col items-center text-[#BABABA]">
							{profile.role} {/* รอใส่ตัวแปร */}
						</div>
					</div>
				</div>

				{/* -------------------- Middle -------------------- */}
				<div
					className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 `}
				>
					<div className="flex flex-1 ">
						<Image
							alt="email icon"
							src="/icons/mail-svgrepo-com.svg"
							width={50}
							height={50}
						/>
						<p className="flex items-center text-[#0E4663]"> Email : </p>
					</div>
					<div className="px-12 text-[#0E4663]">
						{" "}
						{profile.email} {/* รอใส่ตัวแปร */}
					</div>
				</div>

				<div
					className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}
				>
					<div className="flex flex-1 ">
						<Image
							alt="telephone icon"
							src="/icons/telephone-phone-svgrepo-com.svg"
							width={50}
							height={50}
						/>
						<p className="flex items-center text-[#0E4663]">
							{" "}
							Telephone number :{" "}
						</p>
					</div>
					<div className="px-12 text-[#0E4663]">
						{" "}
						{profile.phone_number} {/* รอใส่ตัวแปร */}
					</div>
				</div>

				{/* -------------------- Under -------------------- */}
				<Link
					href="/"
					className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer shadow-xl"
				>
					<div className="flex px-20 py-2">
						<p className="flex items-center text-[#F8F8F8]"> Back </p>
					</div>
				</Link>
				<Link
					href="/"
					className="mt-6 mb-6 bg-[#F8F8F8] text-[#0E4663] rounded-xl hover:bg-[#F8F8F8]/90 hover:cursor-pointer shadow-xl"
				>
					<div className="flex px-20 py-2">
						<p className="flex items-center text-[#0E4663]"> Cancel </p>
					</div>
				</Link>
			</div>
		</>
	);
}

export default function ProfilePage() {
	return (
		<Suspense
			fallback={
				<div className="p-12 text-xl text-[#0E4663] bg-[#F8F8F8] flex w-full justify-center">
					Loading...
				</div>
			}
		>
			<ProfileContent />
		</Suspense>
	);
}
