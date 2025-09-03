import React from "react";
function Features() {
    const items = ["Safety first, always", "Affordable", "Fast & Reliable"];

    return (
        <section className="mt-12 py-15 bg-[#f8f8f8]">
            <h2 className="mb-10 text-center text-3xl font-semibold text-slate-800">
                what we have
            </h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
                {items.map((t) => (
                    <div key={t} className="w-1/2 min-w-[280px] lg:w-1/4 rounded-full bg-white px-6 py-3 text-center shadow-sm ring-1 ring-slate-200">
                        {t}
                    </div>
                ))}
            </div>
        </section>
    );
}
export default Features;