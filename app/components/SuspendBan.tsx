"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconButton, Menu, MenuItem } from "@mui/material";

export default function SuspendBan() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isLarge = false;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSuspend=()=>{

  };
  const handleBan=()=>{

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
            sx: { backgroundColor: "#FFFFFF", borderRadius: 2,  },
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
        
      </Menu>
    </div>
  );
}
