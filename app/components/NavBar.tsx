"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "../lib/api";
import LoginNavBar from "./LoginNavBar";
import { usePathname } from "next/navigation";


function NavBar(){
    const [name,setName]=useState("");
      const [id,setId]=useState("");
      const [isLogin,setIsLogin]=useState(false);
      const [loading,setLoading]=useState(false);
      const [avatarBust, setAvatarBust] = useState(() => Date.now());
      const [src,setSrc]=useState("");
      const PUBLIC_ROUTES = ["/","/login","/register","/setup-account"];
      const pathname = usePathname();
      const isPublic = PUBLIC_ROUTES.includes(pathname);
      useEffect(()=>{
          async function fetchProfile() {
                      try {
                          const result = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`);
                          const apiResponse = await result.json();
                          console.log("Data from API:", apiResponse);
                          setName(apiResponse.data.fullname);
                          // setProfilePic(apiResponse.data.profile_pic);
                          setId(apiResponse.data.id);
                          if(apiResponse.data.profile_pic!=="/globe.svg") setSrc(`${apiResponse.data.profile_pic}?ts=${avatarBust}`);
                          else setSrc("/globe.svg");
                          setIsLogin(true);
                      } catch (err) {
                          console.error("Error fetching profile:", err);
                      } finally {
                          setLoading(false);
                      }
                  }
          fetchProfile();
  
          
      },[]);
    if (isPublic) return (
      <header className="mb-8 lg:mb-0">
        <div className="flex items-center gap-2 bg-[#d9d9d9] px-4 py-3">
           <Image
                  aria-hidden
                  src="/directions_car.svg"
                  alt="Car icon"
                  width={30}
                  height={30}
              />
          <span className="font-semibold text-slate-800">NoCarNoProblem</span>
        </div>
      </header>
    );
    return isLogin ? <LoginNavBar profileSrc={src} id={id} /> : (
      <header className="mb-8 lg:mb-0">
        <div className="flex items-center gap-2 bg-[#d9d9d9] px-4 py-3">
           <Image
                  aria-hidden
                  src="/directions_car.svg"
                  alt="Car icon"
                  width={30}
                  height={30}
              />
          <span className="font-semibold text-slate-800">NoCarNoProblem</span>
        </div>
      </header>
    );
}
export default NavBar;
