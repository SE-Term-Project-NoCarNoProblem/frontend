import React from "react";
function Features() {
    const items = ["Safety first, always", "Affordable", "Fast & Reliable"];

    return (
        <section className="mt-12 py-15 bg-[#0E4663]">
            <h2 className="mb-10 text-center text-4xl font-semibold text-white">
                What We Have
            </h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
                {items.map((t) => (
                    <div key={t} className="w-1/2 min-w-[280px] lg:w-1/4 rounded-full bg-white px-6 py-3 text-center shadow-sm ring-1 ring-slate-200">
                        <p className="text-[#0E4663]">{t}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default Features;