"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";

export default function ProfilePage() {
    const themeColor1 = "#0E4663";
    const themeColor2 = "#F8F8F8";
    const router = useRouter();

    return (<>
        <NavBar />
        <div className="bg-white p-12 flex flex-col items-center text-[#000000] mt-0">
            
            {/* -------------------- Top -------------------- */}
            <div className={`w-full max-w-5xl bg-[#0E4663] rounded-2xl shadow-md p-8 border-r-gray-400`}>
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* -------------------- text above profile pic. -------------------- */}
                    <div className={`w-full text-2xl font-semibold flex justify-between items-center text-[#F8F8F8]`}>
                        <button
                            onClick = {() => router.push("/")}
                            className = "hover:cursor-pointer hover:opacity-70"
                        >
                            <Image
                                alt = "arrow icon"
                                src = "/icons/left-arrow-svgrepo-com.svg"
                                width={50}
                                height={50}  
                            />
                        </button>
                        <div> Profile </div>
                        <button
                            onClick = {() => router.push("/")}
                            className = "hover:cursor-pointer hover:opacity-70 invisible"
                        >
                            <Image
                                alt = "arrow icon"
                                src = "/icons/left-arrow-svgrepo-com.svg"
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
                    <div className="text-2xl font-semibold text-[#F8F8F8]"> First name Last name {/* รอใส่ตัวแปร */} </div>
                    <div className="flex flex-col items-center text-[#F8F8F8]">  
                        Age: xx {/* รอใส่ตัวแปร */}<br/>
                    </div>
                    <div className="flex flex-col items-center text-[#F8F8F8]">  
                        User or Driver {/* รอใส่ตัวแปร */}
                    </div>
                </div>
            </div>

            {/* -------------------- Middle -------------------- */}
            <button 
                onClick={() => router.push("/EditProfile")}
                className=" mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] px-30 py-2 rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer"    
            >
                Edit Profile
            </button>
            <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 `}>
                <div className="flex flex-1 ">
                    <Image
                        alt = "email icon"
                        src = "/icons/mail-svgrepo-com.svg"
                        width={50}
                        height={50}  
                    />
                    <p className="flex items-center text-[#0E4663]"> Email : </p>
                </div>
                <div className="px-12 text-[#0E4663]"> First name Last name {/* รอใส่ตัวแปร */}</div>
            </div>

            <div className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt = "telephone icon"
                        src = "/icons/telephone-phone-svgrepo-com.svg"
                        width={50}
                        height={50}  
                    />
                    <p className="flex items-center text-[#0E4663]"> Telephone number : </p>
                </div>
                <div className="px-12 text-[#0E4663]"> +66 XX XXX XXXX {/* รอใส่ตัวแปร */}</div>
            </div>

            <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4 border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt = "location icon"
                        src = "/icons/location-pin-svgrepo-com.svg"
                        width={50}
                        height={50}  
                    />
                    <p className="flex items-center text-[#0E4663]"> Home : </p>
                </div>
                <div className="px-12 text-[#0E4663]"> Somewhere {/* รอใส่ตัวแปร */}</div>
            </div>

            <div className={`w-full max-w-5xl bg-[#FFFFFF] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt = "heart icon"
                        src = "/icons/heart-svgrepo-com.svg"
                        width={50}
                        height={50}  
                    />
                    <p className="flex items-center text-[#0E4663]"> Favourite location : </p>
                </div>
                <div className="px-12 text-[#0E4663]"> Somewhere {/* รอใส่ตัวแปร */}</div>
            </div>

            <div className={`w-full max-w-5xl bg-[#F8F8F8] rounded-2xl shadow-md p-4  border-r-gray-400 justify-center`}>
                <div className="flex flex-1 ">
                    <Image
                        alt = "Blank icon"
                        // src = "/icons/mail-svgrepo-com.svg"
                        src = ""
                        width={50}
                        height={50}  
                    />
                    <p className="flex items-center text-[#0E4663]"> Blank : </p>
                </div>
                <div className="px-12 text-[#0E4663]"> Blank {/* รอใส่ตัวแปร */}</div>
            </div>

            {/* -------------------- Under -------------------- */}
             <button className="mt-6 mb-6 bg-[#0E4663] text-[#F8F8F8] rounded-xl hover:bg-[#0E4663]/90 hover:cursor-pointer">
             <div className="flex px-30">
                    <Image
                        alt = "log out icon"
                        src = "/icons/log-out-1-svgrepo-com.svg"
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