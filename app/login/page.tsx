"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const themeColor = "#0E4663";
  const [showPassword, setShowPassword] = useState(false);

  return (<>
    <div className="bg-white p-12 flex flex-col items-center text-[#000000]">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8 flex border-r-gray-400">
        <div className="flex-1 pr-8 border-r overflow-auto">
            <h1 className = {`text-2xl font-semibold text-[${themeColor}]`}> Welcom Back</h1>
            <p className= {`text-sm text-[${themeColor}] py-2`}> 
                Don't have an account? {" "}
                <button 
                    className= {`underline text-[${themeColor}] hover:cursor-pointer `}
                    onClick={() => router.push("/register")}
                >
                    Register
                </button>
            </p>

            {/* Form */}
            <form className="mt-6 space-y-4">
                {/* Email */}
                <p className={`text-[${themeColor}] my-0`}> Username </p>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-2 border rounded-md"
                />

                {/* Password */}
                <p className={`text-[${themeColor}] my-0`} > Password</p>
                <div className="flex gap-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-1/2 p-2 border rounded-md w-full"
                    />
                </div>
            </form>

            {/* Show password toggle */}
            <label className={`flex items-center gap-2 text-sm my-1 mb-4 text-[${themeColor}]`}>
                <input 
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                />
                Show password
            </label>

            {/* Submit botton */}
            <button
                className={`w-full bg-[${themeColor}] text-white p-2 rounded-md hover:bg-[${themeColor}]/90 hover:cursor-pointer`}
            >
                Log in
            </button>

        </div>
        <div className="flex-1 flex justify-center ">
            <Image
                aria-hidden 
                src="/temp_image.svg"
                alt="Car illustration"
                width={253}
                height={379}
            />
        </div>

      </div>
    </div>
  </>);
}
