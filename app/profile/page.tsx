"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/api";
import LoginNavBar from "../components/LoginNavBar";

interface Profile {
	fullName: string;
	age: number;
	role: string;
	email: string;
	phoneNumber: string;
	home?: string;
	model?: string;
	registration?: string;
	rating?: number;
	favouriteLocation?: string;
	profilePic: string;
}

export default function ProfilePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<Profile | null>(null);

	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`
				);

				if (!res.ok) {
					throw new Error("Failed to fetch profile, invalid token");
				}

				const apiResponse = await res.json();
				console.log("Data from API:", apiResponse);
				// console.log("API response data keys:", Object.keys(apiResponse.data || {}));

				const data: Profile = {
					fullName: apiResponse.data.fullname,
					age: apiResponse.data.age || 20,
					role: apiResponse.data.role || "User",
					email: apiResponse.data.email,
					phoneNumber: apiResponse.data.phone_number,
					home: apiResponse.data.home || "N/A",
					model: apiResponse.data.model || "N/A",
					registration: apiResponse.data.registration || "N/A",
					rating: 0,
					favouriteLocation: apiResponse.data.favouriteLocation || "N/A",
					profilePic: apiResponse.data.profile_pic || apiResponse.data.profilePic || "/default_profile.webp",
				};
				// console.log("Profile pic set to:", data.profilePic);

				// If driver, fetch vehicle and rating data
				if (isDriver()) {
					// console.log("User is driver, fetching vehicles and rating...");
					// console.log("Driver ID:", apiResponse.data.id);
					try {
						// Fetch vehicles
						const vehiclesUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${apiResponse.data.id}/getVehicles`;
						// console.log("Fetching vehicles from:", vehiclesUrl);
						const vehiclesRes = await fetchWithAuth(vehiclesUrl);
						// console.log("Vehicles response status:", vehiclesRes.status);
						if (vehiclesRes.ok) {
							const vehicles = await vehiclesRes.json();
							console.log("Vehicles data:", vehicles);
							const activeVehicle = vehicles.find((v: any) => v.active);
							console.log("Active vehicle:", activeVehicle);
							if (activeVehicle) {
								data.model = activeVehicle.model;
								data.registration = activeVehicle.registration;
								// console.log("Set model:", data.model, "registration:", data.registration);
							}
						} else {
							const errorText = await vehiclesRes.text();
							// console.log("Vehicles response not ok:", vehiclesRes.status, errorText);
						}

						// Fetch rating
						const ratingUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${apiResponse.data.id}/rating`;
						const ratingRes = await fetchWithAuth(ratingUrl);
						if (ratingRes.ok) {
							const ratingData = await ratingRes.json();
							console.log("Driver rating data:", ratingData);
							if (ratingData.average_rating) {
								// Extract numeric rating from "⭐ 4.5" format
								const ratingMatch = ratingData.average_rating.match(/\d+\.?\d*/);
								if (ratingMatch) {
									data.rating = parseFloat(ratingMatch[0]);
								}
							}
						} else {
							const errorText = await ratingRes.text();
							console.log("Rating response not ok:", ratingRes.status, errorText);
						}
						
					} catch (driverErr) {
						console.error("Error fetching driver details:", driverErr);
					}
				}

				setProfile(data);
				console.log(data);
			} catch (err) {
				console.error("Error fetching profile:", err);
				localStorage.removeItem("token");
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, []);

	function handleLogout() {
		localStorage.removeItem("token");
		router.push("/login");
		alert("You have been logged out.");
	}

	function isDriver() {
		return true;
		// return profile && (profile.role || "").toString().toLowerCase() === "driver";
	}

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
			<LoginNavBar />
			{isDriver() ? (
				<div>
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
							<div className="relative flex rounded-full bg-white w-34 h-32 items-center justify-center border-4 border-gray-300">
								<img
									alt="Profile Picture"
									src={profile.profilePic}
									className="rounded-full w-[120px] h-[120px] object-cover"
								/>
									<div className="absolute border-2 border-white bottom-[-10px] bg-[#0E4663] rounded-full px-2 text-sm text-[#F8F8F8]">
										{profile.rating ? (
											<>
												<span>{profile.rating}</span>
												<span className="text-yellow-400">★</span>
											</>
										) : (
											<span>★ No ratings yet</span>
										)}
									</div>
								</div>

								{/* -------------------- text under pic. -------------------- */}
								<div className="text-2xl font-semibold text-[#F8F8F8]">
									{" "}
									{profile.fullName} {/* รอใส่ตัวแปร */}{" "}
								</div>
								<div className="flex flex-col items-center text-[#F8F8F8]">
									Age: {profile.age}
									<br />
								</div>
								<div className="flex flex-col items-center text-[#BABABA]">
									Driver {/* รอใส่ตัวแปร */}
								</div>
							</div>
						</div>

						{/* -------------------- Middle -------------------- */}
						<button
							onClick={() => router.push("/edit-driver-profile")}
							className=" mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] px-30 py-2 rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer"
						>
							Edit Profile
						</button>
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
								{profile.phoneNumber} {/* รอใส่ตัวแปร */}
							</div>
						</div>

						<div
							className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 justify-center`}
						>
							<div className="flex flex-1 ">
								<Image
									alt="location icon"
									src="/icons/location-pin-svgrepo-com.svg"
									width={50}
									height={50}
								/>
								<p className="flex items-center text-[#0E4663]">
									{" "}
									Model : {profile.model}
								</p>
							</div>
							<div className="px-12 text-[#0E4663]">
								Registration : {profile.registration} {/* รอใส่ตัวแปร */}
							</div>
						</div>

					{/* -------------------- Under -------------------- */}
					<button className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer" onClick={handleLogout}>
							<div className="flex px-30">
								<Image
									alt="log out icon"
									src="/icons/log-out-1-svgrepo-com.svg"
									width={50}
									height={50}
								/>
								<p className="flex items-center text-[#F8F8F8]"> Log out </p>
							</div>
						</button>
					</div>
				</div>
			) : (
				<div>
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
								<img
									alt="Profile Picture"
									src={profile.profilePic}
									className="rounded-full w-[120px] h-[120px] object-cover"
								/>
								</div>

								{/* -------------------- text under pic. -------------------- */}
								<div className="text-2xl font-semibold text-[#F8F8F8]">
									{" "}
									{profile.fullName} {/* รอใส่ตัวแปร */}{" "}
								</div>
								<div className="flex flex-col items-center text-[#F8F8F8]">
									Age: {profile.age}
									<br />
								</div>
								<div className="flex flex-col items-center text-[#BABABA]">
									Customer {/* รอใส่ตัวแปร */}
								</div>
							</div>
						</div>

						{/* -------------------- Middle -------------------- */}
						<button
							onClick={() => router.push("/edit-customer-profile")}
							className=" mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] px-30 py-2 rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer"
						>
							Edit Profile
						</button>
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
								{profile.phoneNumber} {/* รอใส่ตัวแปร */}
							</div>
						</div>

						<div
							className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 justify-center`}
						>
							<div className="flex flex-1 ">
								<Image
									alt="location icon"
									src="/icons/location-pin-svgrepo-com.svg"
									width={50}
									height={50}
								/>
								<p className="flex items-center text-[#0E4663]"> Home : </p>
							</div>
							<div className="px-12 text-[#0E4663]">
								{" "}
								{profile.home} {/* รอใส่ตัวแปร */}
							</div>
						</div>

						<div
							className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}
						>
							<div className="flex flex-1 ">
								<Image
									alt="heart icon"
									src="/icons/heart-svgrepo-com.svg"
									width={50}
									height={50}
								/>
								<p className="flex items-center text-[#0E4663]">
									{" "}
									Favourite location :{" "}
								</p>
							</div>
							<div className="px-12 text-[#0E4663]">
								{" "}
								{profile.favouriteLocation} {/* รอใส่ตัวแปร */}
							</div>
						</div>

					{/* -------------------- Under -------------------- */}
					<button className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer" onClick={handleLogout}>
						<div className="flex px-30">
							<Image
								alt="log out icon"
								src="/icons/log-out-1-svgrepo-com.svg"
								width={50}
								height={50}
							/>
							<p className="flex items-center text-[#F8F8F8]"> Log out </p>
						</div>
					</button>
					</div>
				</div>
			)}
		</>
	);
}
