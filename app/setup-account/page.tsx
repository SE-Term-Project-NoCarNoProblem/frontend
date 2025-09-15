"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    telephone: "",
    idNumber: "",
    gender: "",
    age: "",
    role: "",
    profilePic: null as File | null,
    idPic: null as File | null,
    licensePic: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files ? files[0] : null });
      e.target.value = "";
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Full name validation
    const nameRegex = /^[A-Za-z\- ]+$/;
    if (!form.fullName.trim() || !nameRegex.test(form.fullName)) {
      if (!form.fullName.trim()) alert("Please enter your first name.");
      else alert("First name should contain only letters and hyphen.");
      return;
    }

    // Phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.telephone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // ID number validation (13 digits)
    const idRegex = /^[0-9]{13}$/;
    if (!idRegex.test(form.idNumber)) {
      alert("Please enter a valid 13-digit ID number.");
      return;
    }

    // role validation
    if (!form.role) {
      alert("Please select a role.");
      return;
    }

    // TODO: validate age (must be number)

    // for backend integration
    console.log(form);
  };
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
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
              <input
                type="text"
                placeholder="Full name"
                className="w-full p-2 border rounded-md"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />

            {/* Age */}
            <input
              type="tel"
              placeholder="Age"
              className="w-full p-2 border rounded-md"
              name="age"
              value={form.age}
              onChange={handleChange}
            />

            {/* Telephone + ID */}
            <input
              type="tel"
              placeholder="Telephone number"
              className="w-full p-2 border rounded-md"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="ID number"
              className="w-full p-2 border rounded-md"
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
            />

            {/* Gender */}
            <div>
              <label className="text-sm text-[#0E4663]">
                Gender (optional)
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={form.gender === "male"}
                    onChange={handleChange}
                  />{" "}
                  Male
                </label>
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.gender === "female"}
                    onChange={handleChange}
                  />{" "}
                  Female
                </label>
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input
                    type="radio"
                    name="gender"
                    value="non-binary"
                    checked={form.gender === "non-binary"}
                    onChange={handleChange}
                  />{" "}
                  Non-binary
                </label>
              </div>
            </div>

            {/* ID card upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                className="hidden"
                id="idPic"
                onChange={handleChange}
                name="idPic"
                accept="image/*"
              />
              <label
                htmlFor="idPic"
                className="cursor-pointer flex flex-col items-center"
              >
                {!form.idPic ? (
                  <span className="text-[#0E4663] flex flex-col items-center">
                    <div>
                      <Image
                        aria-hidden
                        src="/upload _cloud.svg"
                        alt="upload cloud icon"
                        width={24}
                        height={24}
                      />
                    </div>
                    Upload your ID card (front side only).
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(form.idPic)}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-2xl object-cover border mb-2"
                    />
                    <span className="text-xs text-[#0E4663]">
                      {form.idPic.name}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Profile picture upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                className="hidden"
                id="profilePic"
                onChange={handleChange}
                name="profilePic"
                accept="image/*"
              />
              <label
                htmlFor="profilePic"
                className="cursor-pointer flex flex-col items-center"
              >
                {!form.profilePic ? (
                  <span className="text-[#0E4663] flex flex-col items-center">
                    <div>
                      <Image
                        aria-hidden
                        src="/upload _cloud.svg"
                        alt="upload cloud icon"
                        width={24}
                        height={24}
                      />
                    </div>
                    Upload your profile picture.
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(form.profilePic)}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-2xl object-cover border mb-2"
                    />
                    <span className="text-xs text-[#0E4663]">
                      {form.profilePic.name}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Role selection */}
            <div>
              <label className="text-sm text-[#0E4663]">Select your role</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={form.role === "user"}
                    onChange={handleChange}
                  />
                  User
                </label>
                <label className="flex items-center gap-1 text-[#0E4663]">
                  <input
                    type="radio"
                    name="role"
                    value="driver"
                    checked={form.role === "driver"}
                    onChange={handleChange}
                  />
                  Driver
                </label>
              </div>
            </div>

            {/* Driver-specific */}

            {form.role=='driver' && 
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
              {/* Driver license upload */}
              <input
                type="file"
                className="hidden"
                id="licensePic"
                onChange={handleChange}
                name="licensePic"
                accept="image/*"
              />
              <label
                htmlFor="licensePic"
                className="cursor-pointer flex flex-col items-center"
              >
                {!form.licensePic ? (
                  <span className="text-[#0E4663] flex flex-col items-center">
                    <div>
                      <Image
                        aria-hidden
                        src="/upload _cloud.svg"
                        alt="upload cloud icon"
                        width={24}
                        height={24}
                      />
                    </div>
                    Upload your driver's license.
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(form.licensePic)}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-2xl object-cover border mb-2"
                    />
                    <span className="text-xs text-[#0E4663]">
                      {form.licensePic.name}
                    </span>
                  </div>
                )}
              </label>
            </div>}

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
