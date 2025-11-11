"use client";

import { useEffect, useState } from "react";


export interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  rating: number;
}

export default function SuspendBanDashboard(
  { users }: { users: Array<UserData> }
) {
  const [data, setData] = useState<Array<UserData>>(users);

  useEffect(() => {
    setData(users);
  }, [users]);

  //show users each row with name,email,status,rating
  return (
      <div className="flex flex-col rounded-xl bg-[#F5F3F3]">
      {data.map((user, index) => (
          <div key={index} className="flex flex-row items-center p-4  rounded-none">
              <p className="flex-1 text-lg text-[#0E4663] tet-center">{user.name}</p>
              <p className="flex-1 text-lg text-[#0E4663] text-center">{user.email}</p>
              <p className="flex-1 text-lg text-[#0E4663] text-center">{user.status}</p>
              <p className="flex-1 text-lg text-[#0E4663] text-center">{user.rating}</p>
          </div>
      ))}
      </div>
  );
};
