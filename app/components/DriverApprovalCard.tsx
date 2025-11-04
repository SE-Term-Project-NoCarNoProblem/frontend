"use client";

import React from "react";
import { useState } from "react";

interface DriverApprovalCardProps {
    driverId : string;
    driverProfile : string;
    idPic : string;
    licensePic : string;
    onApprove : () => void;
    onReject : () => void;
};

const DriverApprovalCard = ({
    driverId,
    driverProfile,
    idPic,
    licensePic,
    onApprove,
    onReject
}: DriverApprovalCardProps) => {
    
    const [openImage, setOpenImage] = useState<string | null>(null);

    return(
        <div className="text-[20px] bg-[#FCFBFE] text-[#0E4663] shadow-md rounded-2xl p-6 m-5 border border-gray-100">
            <div className="font-semibold ">
                Driver ID : <span>{driverId}</span>
            </div>

            <hr className="border border-gray-200 mt-3"/>

            <div className="gap-8 flex text-[18px] text-[#0E4663] flex-wrap md:gap-20 text-sm mb-5 mt-5">
                <p> 
                    Driver Profile : {" "}
                    <a
                        href={driverProfile}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:opacity-60 hover:-translate-y-1 transition active:opacity-50 font-medium"
                    > 
                        Link
                    </a>
                </p>
                <p> 
                    ID Picture : {" "}
                    <button
                        onClick={() => setOpenImage(idPic)}
                        className="underline hover:opacity-60 hover:-translate-y-1 transition active:opacity-50 font-medium"
                    > 
                        View
                    </button>
                </p>
                <p> 
                    License Picture : {" "}
                   <button
                        onClick={() => setOpenImage(licensePic)}
                        className="underline hover:opacity-60 hover:-translate-y-1 transition active:opacity-50 font-medium"
                    > 
                        View
                    </button>
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onReject}
                    className="w-[180px] bg-[#A74242] text-white px-4 py-2 rounded-lg font-medium hover:opacity-80 hover:-translate-y-1 transition hover:shadow-md active:opacity-50"
                >
                    Reject
                </button>
                <button
                    onClick={onApprove}
                    className="w-[180px] bg-[#0E4663] text-white px-4 py-2 rounded-lg font-medium hover:opacity-80 hover:-translate-y-1 transition hover:shadow-md active:opacity-50" 
                >
                    Approve
                </button>
            </div>

            {openImage && (
                <div 
                    onClick={() => setOpenImage(null)}
                    className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
                >
                    <div className="bg-white p-4 shadow-md relative rounded-xl">
                        <img
                            src = {openImage}
                            alt = "image"
                            className="max-w-[90vw] max-h-[80vh] rounded-lg object-contain"
                        />
                        <button
                            onClick={() => setOpenImage(null)}
                            className="absolute top-2 right-2 text-black hover:opacity-60"
                        >
                            x
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DriverApprovalCard;