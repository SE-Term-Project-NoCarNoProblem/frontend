"use client";

import DriverApprovalCard from "../components/DriverApprovalCard"
import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSideBar";

export default function DriverApprovals(){
    const [drivers, setDrivers] = useState([
        {
            driverId : "054133d2-0604-42ba-af89-60f6cd732816",
            driverProfile :"http://localhost:3000/driver-profile",
            idPic : "../../temp_image.svg",
            licensePic : "../../default_profile.webp"
        },
        {
            driverId : "054133d-0604-42ba-af89-60f6cd732816",
            driverProfile :"#",
            idPic : "#",
            licensePic : "#"
        },
        {
            driverId : "054133d-0604-42ba-af89-60f6cd732816",
            driverProfile :"#",
            idPic : "#",
            licensePic : "#"
        },
        {
            driverId : "054133d-0604-42ba-af89-60f6cd732816",
            driverProfile :"#",
            idPic : "#",
            licensePic : "#"
        },
        {
            driverId : "054133d-0604-42ba-af89-60f6cd732816",
            driverProfile :"#",
            idPic : "#",
            licensePic : "#"
        },
        {
            driverId : "054133d-0604-42ba-af89-60f6cd732816",
            driverProfile :"#",
            idPic : "#",
            licensePic : "#"
        }
    ]);
    //  const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        async function getDrivers() {
            // fetch  driverId, driverProfile, idPic, licensePic
            // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/...`);
		    // const data = await res.json();
            // setDrivers(data)
        }
        getDrivers();
    }, [])

    const handleApprove = (driverId:string) => {
        // adapt something in DB : verified_driver
        // change driver status to Verified
        alert(`Approved ${driverId}`)
        setDrivers((prevDrivers) => 
            prevDrivers.filter((driver) => driver.driverId != driverId)
        )
    }
     const handleReject = (driverId:string) => {
        // adapt something in DB : rejected_driver
        // change driver status to Rejected
        alert(`Reject ${driverId}`)
        setDrivers((prevDrivers) => 
            prevDrivers.filter((driver) => driver.driverId != driverId)
        )
    }

    return (
        <div className="py-6 bg-white min-h-screen flex">
            <AdminSidebar/>
            <div className="flex-1">
                <div className="text-[20px] text-lg font-semibold flex items-center gap-2 mb-4 text-[#0E4663]">
                    <span> 
                        <img
                            src={'../../stash_person-duotone.svg'}
                            alt="human logo"
                        />
                    </span>
                    Driver Approvals
                </div>

                <hr className="border border-gray-200 my-4"/>

                <div className="h-170 overflow-y-scroll">
                    {drivers.length === 0 ? (
                        <div className="text-lg font-semibold flex items-center gap-2 mb-4 text-[#0E4663]"> All Drivers has been considered</div>
                    ) :(
                        drivers.map((driver) => (
                            <DriverApprovalCard
                                key = {driver.driverId}
                                driverId = {driver.driverId}
                                driverProfile = {driver.driverProfile}
                                idPic = {driver.idPic}
                                licensePic = {driver.licensePic}
                                onApprove = {() => handleApprove(driver.driverId)}
                                onReject = {() => handleReject(driver.driverId)}
                            />
                        )))
                    }
                </div>
            </div>
        </div>
    )
}