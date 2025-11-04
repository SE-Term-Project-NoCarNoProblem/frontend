"use client";
import { Avatar} from "@mui/material";
import { IconButton } from "@mui/material";
import Image from "next/image";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { useRouter } from "next/navigation";

export default function Chat() {
    const router=useRouter();
    const driverName = "Sippakorn Thanyaharn";
    const driverCar = "Honda civic (Black) : กข 1234";
    const rating = 5.00;
    const handleClick=()=>{
        router.push("/location");
    }
    return (<div>
        <div className="flex fixed w-12/12 bg-[#D9D9D9] z-10">
            <div className="m-2 flex items-center">
                <IconButton onClick={handleClick}>
                    <Image src="/icons/left-arrow.svg" alt="back icon" width={30} height={30} />
                </IconButton>
            </div>
            <div className="flex flex-start items-center">
                <div className="relative flex rounded-full bg-white w-15 h-15 items-center justify-center border-4 m-3 mx-4 border-gray-300">
                    <Image
                        alt="Profile Picture"
                        src={`./globe.svg`}
                        width={52}
                        height={52}
                        className="rounded-full"
                    />
                    {
                        rating ? <div className="absolute border-2 border-white bottom-[-10px] bg-[#0E4663] rounded-full px-2 text-sm text-[#F8F8F8]">

                            <span>{rating}</span>
                            <span className="text-yellow-400">★</span>

                        </div> : <div></div>
                    }

                </div>
                <div className="flex flex-col justify-center items-start mx-4 ">
                    <p className="font-semibold text-[16px]">{driverName}</p>
                    <p className="text-[10px]">{driverCar}</p>
                </div>
            </div>

        </div>
        <div className="flex flex-col gap-4 mb-20">
            <div className="w-12/12 flex px-5 p-3 mt-20 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account1</div>
                    <div>Hello</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account2</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account3</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account4</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account5</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account5</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account5</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account5</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account5</div>
                    <div>message1</div>
                </div>
            </div>
            <div className="w-12/12 flex px-5 p-3 gap-4 hover:bg-[oklch(96.8%_0.007_247.896)] hover:cursor-pointer">
                <Avatar sx={{ bgcolor: '#0E4663', color: "white" }}>ST</Avatar>
                <div>
                    <div>account5</div>
                    <div>message1</div>
                </div>
            </div>
        </div>
        <div className="flex justify-center fixed bottom-6 w-full px-3">
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", maxWidth: "1000px" }}
            >

                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={`send message to ${driverName}`}
                    inputProps={{ 'aria-label': 'search google maps' }}
                />

                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                    <Image src="/icons/send.svg" alt="send icon" width={24} height={24} />
                </IconButton>
            </Paper>
        </div>

    </div>)
}