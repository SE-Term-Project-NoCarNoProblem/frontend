"use client";

import { useState } from "react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const themeColor = "#0E4663";
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);     

    function handleChange(e:any){
        console.log(e.target.value);
        setForm({...form, [e.target.name]: e.target.value}); 
    }

    async function handleSubmit(e:any){
        e.preventDefault(); 
        setIsLoading(true); 
        setError(null);

        try {
            const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email:form.email, password:form.password})
            });

            
            const data = await loginResponse.json();
            if (!loginResponse.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }
            
            localStorage.setItem('token', data.token);

            if(data.status == 'requires-setup'){
                router.push('/setup-account');
            } else {
                router.push('/');
            }


        } catch(err: any) {
            console.error("Login Error:", err);
            setError(err.message);
        } finally{
            setIsLoading(false);
        }

        // console.log(`email : `, form.email);
        // console.log(`password : `, form.password);
    }

  return (<>
    <div className="flex items-center justify-center w-full min-h-screen bg-white text-[#000000]">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8 flex flex-col min-[680px]:flex-row min-[680px]:border-r min-[680px]:border-gray-400 min-w-[350px]">
        <div className=" min-[680px]:flex-1 pr-8 min-[680px]:border-r overflow-auto ">
            <h1 className = {`text-2xl font-semibold  max-[680]:text-center max-[680]:text-4xl` } style={{ color: themeColor }}> 
                Welcome Back
            </h1>
            <p className= {`text-sm  py-2 max-[680]:text-center`} style={{ color: themeColor }}> 
                Don't have an account? {" "}
                <button 
                    className= {`underline hover:cursor-pointer `}
                    onClick={() => router.push("/register")}
                    style={{ color: themeColor }}
                >
                    Register
                </button>
            </p>
            <div className="flex-1 flex justify-center mt-8 min-[679px]:hidden" >
                <Image
                    aria-hidden 
                    src="/temp_image.svg"
                    alt="Car illustration"
                    width={230}
                    height={320}
                />
            </div>

            {/* ---------------- Form ---------------- */}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {/* ---------------- Email ---------------- */}
                <p className={`my-0`} style={{ color: themeColor }}> Email </p>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-2 border rounded-md"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                />

                {/* ---------------- Password ---------------- */}
                <p className={`my-0`} style={{ color: themeColor }} > Password</p>
                <div className="flex gap-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-1/2 p-2 border rounded-md w-full"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                </div>

                 {/* ---------------- Show password toggle ---------------- */}
                <label className={`flex items-center gap-2 text-sm my-1 mb-4`} style={{ color: themeColor }}>
                    <input 
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Show password
                </label>

                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                        {error}
                    </div>
                )}

                {/* ---------------- Submit botton ---------------- */}
                <button
                    type="submit"
                    className={`w-full text-white p-2 rounded-md  hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: themeColor }}
                    disabled={isLoading} 
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>
            </form>
                <div className="flex items-center w-full my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">or login with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                    onClick={() => router.push("./googleLogin")}
                    type="button"
                    className={`w-full flex items-center gap-2 justify-center border-1 border-gray-900 text-black p-2 rounded-md  hover:cursor-pointer my-4 opacity-100 hover:opacity-50` }
                >
                        <Image
                            aria-hidden
                            alt="Google"
                            src="/google-icon-logo-svgrepo-com.svg"
                            width={25}
                            height={25}
                        />
                    <span>    
                        Google
                    </span>
                </button>
        </div>
        

        <div className="flex-1 flex justify-center max-[680px]:hidden">
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
