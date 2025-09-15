import React from "react";
import Image from "next/image";
function NavBar(){
    return (<header className="mb-8 lg:mb-0">
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
    </header>);
}
export default NavBar;