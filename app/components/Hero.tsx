import React from "react";
import Link from "next/link";
import Image from "next/image";
function Hero(){
    return (<section className="text-center">
      <h1 className="text-4xl font-semibold leading-tight text-slate-800 mt-15">
        Move people.<br/>Move life.
      </h1>
      <p className="mt-7 px-20 text-slate-600">
        From campus to clinics to late-night rides home, our drivers arrive fast and drive with care.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3">
        <Link href="/login" className="w-40 rounded-xl bg-slate-700 px-5 py-2 text-center text-white hover:bg-slate-800">
          sign in
        </Link>
        <Link href="/register" className="w-40 rounded-xl bg-slate-700 px-5 py-2 text-center text-white hover:bg-slate-800">
          sign up
        </Link>
      </div>
      <div className="rounded-3xl p-8 mt-10 flex justify-center">
        <Image
          src="/temp_image.svg"
          alt="rides illustration"
          width={253}
          height={379}
          
          
        />
      </div>
    </section>);
}
export default Hero;