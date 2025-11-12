"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation"
import { fetchWithAuth } from "../lib/api";
type Role = "DRIVER" | "CUSTOMER";
type SuspendBanProps = {
  role: Role;
  userId: string;
};
export default function SuspendBan(Props: SuspendBanProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isLarge = false;
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSuspend = async () => {
    //some fetch endpoint using userId
    const now = new Date();
    now.setDate(now.getDate() + 7);
    const suspendUntil = now.toISOString();
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${Props.userId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "suspend",
        until: suspendUntil
      })
    })
    const response = await res.json();
    if (!response) alert("Error suspending user");
  };
  const handleBan = async () => {
    //some fetch endpoint using userId
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${Props.userId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "suspend",
      })
    })
    const response = await res.json();
    if (!response) alert("Error banning user");
  };
  const handleAnalytic = () => {
    router.push("/landing-page");
  };

  return (
    <div className="w-[50px] lg:w-1/12 min-w-[50px] h-full flex justify-center lg:justify-end  rounded-xl   lg:rounded-none ">
      <IconButton onClick={handleClick}>
        <Image src="/icons/suspend-ban-action.svg" alt="suspend ban action" width={32} height={32} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
        slotProps={{
          paper: {
            className: "mt-2 translate-y-[5px] lg:translate-y-0px[]",
            sx: { backgroundColor: "#FFFFFF", borderRadius: 2, },
          },
        }}
      >
        <MenuItem onClick={handleSuspend}>
          <div className="flex w-full justify-between gap-3 text-[#0E4663]">
            <Image src="/icons/suspend.svg" alt="suspend icon" width={32} height={32} />
            <div className="flex justify-start w-12/12">
              <p className="text-[20px]">suspend</p>
            </div>

          </div>
        </MenuItem>
        <MenuItem onClick={handleBan}>
          <div className="flex w-full justify-between gap-3 text-[#0E4663] ">
            <Image src="/icons/ban.svg" alt="ban icon" width={32} height={32} />
            <div className="flex justify-start w-12/12">
              <p className="text-[20px]">ban</p>
            </div>
          </div>
        </MenuItem>
        {Props.role === "DRIVER" && <MenuItem onClick={handleAnalytic}>
          <div className="flex w-full justify-between gap-3 text-[#0E4663] ">
            <Image src="/icons/analytic.svg" alt="analytic icon" width={32} height={32} />
            <div className="flex justify-start w-12/12">
              <p className="text-[20px]">analytic</p>
            </div>

          </div>
        </MenuItem>}

      </Menu>
    </div>
  );
}
