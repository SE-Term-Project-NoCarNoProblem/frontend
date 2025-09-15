import React from "react";
import Link from "next/link";
import Image from "next/image";
function Hero() {
    return (<section className="text-center">
        <div className="flex flex-col lg:flex-row lg:justify-around">


            <div className="lg:w-1/2 lg:flex lg:flex-col lg:items-start lg:justify-center  mt-5">
                <h1 className="text-5xl lg:text-left font-semibold leading-tight text-slate-800 ">
                    Move people.<br />Move life.
                </h1>
                <p className="mt-7 text-slate-600 px-10 lg:px-0 lg:text-left">
                    From campus to clinics to late-night rides home, our drivers arrive fast and drive with care.
                </p>
                <div className="mt-10 flex flex-col lg:flex-row items-center gap-3">
                    <Link href="/login" className="w-40 rounded-xl bg-slate-700 px-5 py-2 text-center text-white hover:bg-slate-800">
                        Sign in
                    </Link>
                    <Link href="/register" className="w-40 rounded-xl bg-slate-700 px-5 py-2 text-center text-white hover:bg-slate-800">
                        Sign up
                    </Link>
                </div>

            </div>


            <div className="rounded-3xl p-8 mt-10 flex justify-center">
                <Image
                    src="/temp_image.svg"
                    alt="rides illustration"
                    width={253}
                    height={379}


                />
            </div>
        </div>
    </section>);
}
export default Hero;