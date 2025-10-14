"use client";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import LoginNavBar from "../components/LoginNavBar";
import Hero from '../components/Hero';
import Image from "next/image";
import Link from "next/link";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { fetchWithAuth } from "../lib/api";



export default function Landing() {
    const [name,setName]=useState("");
    const [profilePic,setProfilePic]=useState("/globe.svg");
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        async function fetchProfile() {
                    try {
                        const result = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`);
        
                        const apiResponse = await result.json();
                        console.log("Data from API:", apiResponse);
                        setName(apiResponse.data.fullname);
                        setProfilePic(apiResponse.data.profile_pic);
                    } catch (err) {
                        console.error("Error fetching profile:", err);
                    } finally {
                        setLoading(false);
                    }
                }
        fetchProfile();

        
    },[]);
    return (
        <main className="min-h-dvh bg-white">
            <div className="">
                <LoginNavBar profilePic={profilePic}/>
                <section className="text-center">
                    <div className="flex flex-col lg:flex-row lg:justify-around">


                        <div className="lg:w-1/2 lg:flex lg:flex-col lg:items-start lg:justify-center  mt-5">
                            <h1 className="text-5xl lg:text-left font-semibold leading-tight text-slate-800 ">
                                Welcome {name}.
                            </h1>
                            <p className="mt-7 text-slate-600 px-10 lg:px-0 lg:text-left">
                                From campus to clinics to late-night rides home, our drivers arrive fast and drive with care.
                            </p>
                            

                        </div>


                        <div className="rounded-3xl p-8 mt-10 flex justify-center">
                            <Image
                                src="/temp_image.svg"
                                alt="rides illustration"
                                width={253}
                                height={379}


                            />
                        </div>
                    </div>
                </section>
                <Features />
                <Footer />

            </div>
        </main>


    );
}
