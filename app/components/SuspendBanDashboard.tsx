"use client";

import { useEffect, useState } from "react";
import Action from "./SuspendBan";

export interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  rating?: number;
  role: "DRIVER" | "CUSTOMER";
}

interface SuspendBanDashboardProps {
  users: Array<UserData>;
  role: "DRIVER" | "CUSTOMER";
};

export default function SuspendBanDashboard(
  { users, role }: SuspendBanDashboardProps
) {
  const [data, setData] = useState<Array<UserData>>(users);

  useEffect(() => {
    setData(users);
  }, [users]);

  //show users each row with name,email,status,rating
  return (
      <div className="flex flex-col rounded-xl bg-[#F5F3F3] divide-y-4 divide-white ">
        {role === "DRIVER" ? (
          data.map((user, index) => (
            user.role === "DRIVER" && (
              <div key={index} className="flex flex-row items-center p-4  rounded-none">
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.name}</p>
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.email}</p>
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.status}</p>
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.rating}</p>
                <div className="flex-1 flex justify-center">
                  <Action role={role} userId={user.id} />
                </div>
              </div>
            )
          ))
        ) : (
          data.map((user, index) => (
            user.role === "CUSTOMER" && (
              <div key={index} className="flex flex-row items-center p-4  rounded-none">
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.name}</p>
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.email}</p>
                <p className="flex-1 text-xs md:text-lg text-[#0E4663] text-center">{user.status}</p>
                <div className="flex-1 flex justify-center">
                  <Action role={role} userId={user.id} />
                </div>
              </div>
            )
          ))
        )}
        </div>
  );
};
