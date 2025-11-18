"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginNavBar from "../components/LoginNavBar";
import EditProfileInput from "../components/EditProfileInput";
import { fetchWithAuth, fetchWithAuthFile } from "../lib/api";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
interface Profile {
	fullName: string;
	age: string;
	gender: string;
	role: string;
	// email: string;
	phoneNumber: string;
	profilePic: string;
}
function EditProfile() {
	const router = useRouter();
	const [vehiclesData, setVehiclesData] = React.useState<any[]>([]);
	const [selectedVehicleIds, setSelectedVehicleIds] = React.useState<string[]>(
		[]
	);
	const [driverId, setDriverId] = useState<string | null>(null);

	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isDriver, setIsDriver] = useState(false);
	const [isCustomer, setIsCustomer] = useState(false);
	const role = isDriver ? "Driver" : "Customer";
	const [name, setName] = useState("");
	const [gender, setGender] = useState("");
	const [phone, setPhone] = useState("");
	const [form, setForm] = useState<{ profilePic: File | null }>({
		profilePic: null,
	});
	const [preview, setPreview] = useState<string | null>(null); //profilePic task
	const handleVehicleChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		setSelectedVehicleIds(value ? [value] : []);
	};
	useEffect(() => {
		async function fetchProfile() {
			try {
				const result = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`
				);

				const apiResponse = await result.json();

				// Set role booleans from backend response
				setIsDriver(apiResponse.data.isDriver || false);
				setIsCustomer(apiResponse.data.isCustomer || false);

				if (apiResponse.data.isDriver) {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${apiResponse.data.id}/getVehicles`
					);
					const result2 = await res.json();
					setVehiclesData(result2);
					const activeVehicle = result2.find((vehicle: any) => vehicle.active);
					if (activeVehicle) {
						setSelectedVehicleIds([activeVehicle.id]);
					}
				}
				console.log("Data from API:", apiResponse);
				console.log(apiResponse.data.profile_pic);
				const data = {
					// not complete
					fullName: apiResponse.data.fullname,
					age: apiResponse.data.age,
					role: "User",
					phoneNumber: apiResponse.data.phone_number,
					gender: apiResponse.data.gender,
					profilePic: apiResponse.data.profile_pic || "/globe.svg",
				};
				setProfile(data);
				setDriverId(apiResponse.data.id);
				console.log(data);
			} catch (err) {
				console.error("Error fetching profile:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, []);
	useEffect(() => {
		if (!preview) return;
		return () => URL.revokeObjectURL(preview);
	}, [preview]);

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

	async function onSave() {
		const nameNormalized = name
			.trim()
			.split(/\s+/)
			.map((w) =>
				w
					.split(/([-'])/)
					.map((part) =>
						/[-']/.test(part)
							? part
							: part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
					)
					.join("")
			)
			.join(" ");

		const phoneNormalized = phone.trim();
		const genderNormalized = gender.trim().toLowerCase();

		setName(nameNormalized);
		setPhone(phoneNormalized);
		setGender(genderNormalized);

		const payload: Record<string, string> = {};
		if (nameNormalized) payload.fullname = nameNormalized;
		if (genderNormalized) payload.gender = genderNormalized;
		if (phoneNormalized) payload.phone_number = phoneNormalized;

		if (Object.keys(payload).length > 0) {
			const result = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			if (!result.ok) throw new Error(`PATCH /me failed: ${result.status}`);
		}
		if (form.profilePic != null) {
			if (profile != null) {
				if (profile.profilePic != "/globe.svg") {
					const deleteOldProfile = await fetchWithAuth(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/delete`,
						{
							method: "DELETE",
						}
					);
					console.log(deleteOldProfile);
					if (!deleteOldProfile.ok)
						throw new Error(
							`POST /profile/delete failed: ${deleteOldProfile.status}`
						);
				}
			}
			try {
				const result2 = await fetchWithAuthFile(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/upload`,
					form.profilePic,
					"profilePicture"
				);
				console.log(result2);
			} catch (err) {
				console.log(err);
			}
		}
		if (isDriver && driverId && selectedVehicleIds.length > 0) {
			const vehicleId = selectedVehicleIds[0];
			const vehicleUpdateResult = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${vehicleId}/${driverId}/vehicle`,
				{
					method: "PUT",
				}
			);
			if (!vehicleUpdateResult.ok)
				throw new Error(
					`PUT /drivers/${vehicleId}/${driverId}/vehicle failed: ${vehicleUpdateResult.status}`
				);
		}

		console.log("saved");
		router.push("/profile");
	}

	//handleChange of upload new profilePic
	const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setForm({ profilePic: file });
		setPreview(file ? URL.createObjectURL(file) : null);
	};

	async function handleDelete() {
		if (!confirm("Are you sure you want to delete your account?")) return;

		try {
			const res = await fetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
				{
					method: "DELETE",
				}
			);

			if (!res.ok) throw new Error("Failed to delete account");

			localStorage.removeItem("token");
			alert("Your account has been deleted.");
			router.push("/");
		} catch (error) {
			console.error(error);
			alert("An error occurred while deleting your account.");
		}
	}

	return (
		<>
			<LoginNavBar />
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
								onClick={() => router.push("/profile")}
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

						<div className="relative inline-block">
							{/* Avatar circle */}
							<div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
								{preview ? (
									<img
										src={preview}
										alt="profile preview"
										className="w-full h-full object-cover"
									/>
								) : (
									<Image
										src={`${profile.profilePic}?ts=${Date.now()}`} // fallback or old avatar from DB
										alt="default avatar"
										width={160}
										height={160}
										className="w-full h-full object-cover"
									/>
								)}
							</div>

							{/* Hidden input */}
							<input
								type="file"
								id="profilePic"
								name="profilePic"
								className="hidden"
								accept="image/*"
								onChange={handleProfilePicChange}
							/>

							{/* Camera button */}
							<label
								htmlFor="profilePic"
								className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-white p-2 shadow ring-2 ring-white"
							>
								<Image
									alt="camera icon"
									src="/icons/Camera.svg"
									width={30}
									height={30}
								/>
							</label>
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
						<div className="flex flex-col items-center text-[#F8F8F8]">
							{role} {/* รอใส่ตัวแปร */}
						</div>
					</div>
				</div>
				{/* middle part */}
				<div
					className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 my-4`}
				>
					<div className="flex flex-1 ">
						<Image
							alt="name icon"
							src="/icons/person.svg"
							width={25}
							height={25}
							className="m-3 mr-2"
						/>
						<p className="flex items-center text-[#0E4663]"> Name : </p>
					</div>
					<EditProfileInput
						name="name"
						value={name}
						text="First name Last name"
						onChange={setName}
					/>
				</div>
				<div
					className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}
				>
					<div className="flex flex-1 ">
						<Image
							alt="gender icon"
							src="/icons/age.svg"
							width={25}
							height={25}
							className="m-3"
						/>
						<p className="flex items-center text-[#0E4663]"> gender : </p>
					</div>
					<EditProfileInput
						name="Gender"
						value={gender}
						text="XX"
						onChange={setGender}
					/>
				</div>

				<div
					className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center my-4`}
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
					<EditProfileInput
						name="phone number"
						value={phone}
						text="+66 xx-xxx-xxxx"
						onChange={setPhone}
					/>
				</div>

				{isDriver ? (
					<div
						className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}
					>
						<div className="flex flex-1 items-center gap-3">
							<Image
								alt="car icon"
								src="/icons/car.svg"
								width={40}
								height={40}
							/>
							<p className="flex items-center text-[#0E4663]">Vehicle:</p>
						</div>
						<div>
							<div className="flex lg:justify-center">
								<div className="w-full lg:w-9/12">
									<FormControl sx={{ mt: 1 }} fullWidth>
										<InputLabel id="active-vehicle-label">
											Active vehicle
										</InputLabel>
										<Select
											labelId="active-vehicle-label"
											id="active-vehicle-select"
											value={selectedVehicleIds[0] ?? ""}
											label="Active vehicle"
											displayEmpty
											onChange={handleVehicleChange}
											disabled={vehiclesData.length === 0}
										>
											<MenuItem value="">
												<em>
													{vehiclesData.length
														? "Choose active vehicle"
														: "No vehicles available"}
												</em>
											</MenuItem>
											{vehiclesData.map((vehicle: any) => (
												<MenuItem key={vehicle.id} value={vehicle.id}>
													{vehicle.make} {vehicle.model} {vehicle.registration}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>
						</div>
					</div>
				) : (
					""
				)}
				<button
					className={`bg-[#0E4663] mt-15 text-[#F5F5F5] min-w-fit max-w-56 w-1/4 p-5 rounded-xl  hover:bg-[#0E4663]/90 hover:cursor-pointer`}
					onClick={onSave}
				>
					Confirm change
				</button>

				<button className="mt-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer mx-auto">
					<div className="flex w-55">
						<Image
							alt="log out icon"
							src="/icons/log-out-1-svgrepo-com.svg"
							width={50}
							height={50}
						/>
						<p className="p-5 text-[#F8F8F8] ml-3"> Log out </p>
					</div>
				</button>
				<button
					className="mt-6 w-55 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer"
					onClick={handleDelete}
				>
					<div className="flex p-5 bg-[#A74242] rounded-xl font-medium hover:bg-[#A74242]/90">
						<p className="flex items-center text-white mx-auto">
							{" "}
							Delete Account{" "}
						</p>
					</div>
				</button>
			</div>
		</>
	);
}
export default EditProfile;
