"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
//  #0E4663
  return (
    <div className="bg-white p-12 flex flex-col items-center text-[#000000]">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8 flex border-r-gray-400">
        {/* Left side form */}
        <div className="flex-1 pr-8 border-r overflow-auto">
          <h1 className="text-2xl font-semibold text-[#0E4663]"> Set up Account</h1>
          <p className="text-sm text-[#0E4663] py-2">
            Already has an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="underline text-[#0E4663] hover:cursor-pointer"
            >
              Log in
            </button>
          </p>

          {/* Form */}
          <form className="mt-6 space-y-4">
            {/* Name */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>

            {/* Telephone + ID */}
            <input
              type="tel"
              placeholder="Telephone number"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="ID number"
              className="w-full p-2 border rounded-md"
            />

            {/* Gender */}
            <div>
              <label className="text-sm text-[#0E4663]">Gender (optional)</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input type="radio" name="gender" value="male" /> Male
                </label>
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input type="radio" name="gender" value="female" /> Female
                </label>
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input type="radio" name="gender" value="non-binary" /> Non-binary
                </label>
              </div>
            </div>

            {/* Profile picture upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
              <input type="file" className="hidden" id="profilePic" />
              <label htmlFor="profilePic" className="cursor-pointer flex flex-col items-center">
                <div>
                        <Image
                            aria-hidden
                            src="/upload _cloud.svg"
                            alt="upload cloud icon"
                            width={24}
                            height={24}
                        />
                </div>
                <span className="text-[#0E4663]">Upload your profile picture.</span>
              </label>
            </div>

            {/* Role selection */}
            <div>
              <label className="text-sm text-[#0E4663]">Select your role</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input type="radio" name="role" value="user" /> User
                </label>
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input type="radio" name="role" value="driver" /> Driver
                </label>
              </div>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-2 border rounded-md"
            />

            {/* Password */}
            <div className="flex gap-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
            <p className="text-xs text-[#0E4663]">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>

            {/* Show password toggle */}
            <label className="flex items-center gap-2 text-sm text-[#0E4663]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show password
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0E4663] text-white p-2 rounded-md hover:bg-[#0E4663]/90 hover:cursor-pointer"
            >
              Create an account
            </button>
          </form>
        </div>

        {/* Right side illustration */}
        <div className="flex-1 flex justify-center">
                <div>
                        <Image
                            aria-hidden
                            src="/temp_image.svg"
                            alt="upload cloud icon"
                            width={253}
                            height={379}
                        />
                </div>
        </div>
      </div>
    </div>
  );
}
