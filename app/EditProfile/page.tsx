"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
import EditProfileInput from "../components/EditProfileInput"
interface Profile {
    firstName: string;
    lastName: string;
    age: number;
    role: string;
    email: string;
    phoneNumber: string;
    home: string;
    favouriteLocation: string;
}
function EditProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [home, setHome] = useState("");
    const [favLoc, setFavLoc] = useState("");
    const [form, setForm] = useState<{ profilePic: File | null }>({//profilePic task
        profilePic: null,
    });
    const [preview, setPreview] = useState<string | null>(null);//profilePic task
    useEffect(() => {

        async function fetchProfile() {
            try {
                // const res = await fetch("http://localhost:5000/api/profile");
                // const data = await res.json();
                const data = { // mock data
                    firstName: "string",
                    lastName: "string",
                    age: 8,
                    role: "User",
                    email: "string",
                    phoneNumber: "string",
                    home: "string",
                    favouriteLocation: "string"
                }
                setProfile(data);
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
        return <div className="p-12 text-xl text-[#0E4663] bg-[#F8F8F8] flex w-full justify-center">Loading...</div>;
    }

    if (!profile) {
        return <div className="p-12 text-xl text-[#0E4663] bg-[#F8F8F8] flex w-full justify-center">No profile data</div>;

    }

    async function onSave() {
        // const fd = new FormData();

        // // only send non-blank fields so you don't overwrite unchanged values
        // if (name.trim()) fd.append("name", name.trim());
        // if (age.trim()) fd.append("age", age.trim());
        // if (email.trim()) fd.append("email", email.trim());
        // if (phone.trim()) fd.append("phone", phone.trim());
        // if (home.trim()) fd.append("home", home.trim());
        // if (favLoc.trim()) fd.append("favLoc", favLoc.trim());

        // // include new profilePic if user picked one
        // if (form.profilePic) {
        //     fd.append("profilePic", form.profilePic); // field name must match backend
        // }

        // const res = await fetch("http://localhost:5000/api/editProfile", {
        //     method: "PATCH",
        //     body: fd,                // <-- multipart/form-data
        //     credentials: "include",
        // });

        // const data = await res.json();
        // if (!res.ok) {
        //     console.error(data);
        //     alert(data.error || "Save failed");
        //     return;
        // }
        console.log("saved");
    }

    //handleChange of upload new profilePic
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm({ profilePic: file });
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    return (<>
        <NavBar />
        <div className="bg-white p-12 flex flex-col items-center text-[#000000] mt-0">

            {/* -------------------- Top -------------------- */}
            <div className={`w-full max-w-5xl bg-[#0E4663] rounded-2xl shadow-md p-8 border-r-gray-400`}>
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* -------------------- text above profile pic. -------------------- */}
                    <div className={`w-full text-2xl font-semibold flex justify-between items-center text-[#F8F8F8]`}>
                        <button
                            onClick={() => router.push("/Profile")}
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
                                <img src={preview} alt="profile preview" className="w-full h-full object-cover" />
                            ) : (
                                <Image
                                    src="/globe.svg"   // fallback or old avatar from DB
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
                            onChange={handleChange}
                        />

                        {/* Camera button */}
                        <label
                            htmlFor="profilePic"
                            className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-white p-2 shadow ring-2 ring-white"
                        >
                            <Image alt="camera icon" src="/icons/Camera.svg" width={30} height={30} />
                        </label>


                    </div>






                    {/* -------------------- text under pic. -------------------- */}
                    <div className="text-2xl font-semibold text-[#F8F8F8]"> {profile.firstName} {profile.lastName} {/* รอใส่ตัวแปร */} </div>
                    <div className="flex flex-col items-center text-[#F8F8F8]">
                        Age: {profile.age}<br />
                    </div>
                    <div className="flex flex-col items-center text-[#F8F8F8]">
                        {profile.role} {/* รอใส่ตัวแปร */}
                    </div>
                </div>
            </div>
            {/* middle part */}
            <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 `}>
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
                <EditProfileInput name="name" value={name} text="First name Last name" onChange={setName} />
            </div>
            <div className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt="email icon"
                        src="/icons/age.svg"
                        width={25}
                        height={25}
                        className="m-3"
                    />
                    <p className="flex items-center text-[#0E4663]"> Age : </p>
                </div>
                <EditProfileInput name="age" value={age} text="XX" onChange={setAge} />
            </div>
            <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 `}>
                <div className="flex flex-1 ">
                    <Image
                        alt="email icon"
                        src="/icons/mail-svgrepo-com.svg"
                        width={50}
                        height={50}

                    />
                    <p className="flex items-center text-[#0E4663]"> Email : </p>
                </div>
                <EditProfileInput name="email" value={email} text="nocarnoproblem@gmail.com" onChange={setEmail} />
            </div>
            <div className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt="telephone icon"
                        src="/icons/telephone-phone-svgrepo-com.svg"
                        width={50}
                        height={50}
                    />
                    <p className="flex items-center text-[#0E4663]"> Telephone number : </p>
                </div>
                <EditProfileInput name="phone number" value={phone} text="+66 xx-xxx-xxxx" onChange={setPhone} />
            </div>

            <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt="location icon"
                        src="/icons/location-pin-svgrepo-com.svg"
                        width={50}
                        height={50}
                    />
                    <p className="flex items-center text-[#0E4663]"> Home : </p>
                </div>
                <EditProfileInput name="home" value={home} text="" onChange={setHome} />
            </div>

            <div className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt="heart icon"
                        src="/icons/heart-svgrepo-com.svg"
                        width={50}
                        height={50}
                    />
                    <p className="flex items-center text-[#0E4663]"> Favourite location : </p>
                </div>
                <EditProfileInput name="favLoc" value={favLoc} text="" onChange={setFavLoc} />
            </div>

            {/* <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 justify-center`}>
                
            </div> */}
            <button className={`bg-[#0E4663] mt-15 text-[#F5F5F5] min-w-fit max-w-56 w-1/4 p-5 rounded-xl`} onClick={onSave}>Confirm change</button>

            <button className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer">
                <div className="flex px-30">
                    <Image
                        alt="log out icon"
                        src="/icons/log-out-1-svgrepo-com.svg"
                        width={50}
                        height={50}
                    />
                    <p className="flex items-center text-[#F8F8F8]"> Log out  </p>
                </div>

            </button>

        </div>
    </>
    );
}
export default EditProfile;
