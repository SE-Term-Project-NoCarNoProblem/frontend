"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Drop this file at: app/tickets/new/page.tsx
 * TailwindCSS required. Mobile-first, desktop-friendly.
 */
export default function Page() {
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [details, setDetails] = useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Replace with your submit logic / API call
        console.log({ from: "Sippakorn Thunyahan", topic, details });
        alert("Ticket submitted (demo)\nCheck console for payload.");
    }

    return (
        <main className="min-h-dvh bg-white text-slate-800">
            {/* Top bar */}
            <div className="sticky top-0 z-10 w-full bg-[#0E4663] text-white">
                <div className="mx-auto flex h-14 max-w-screen-sm items-center gap-3 px-3 sm:px-4">
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={() => router.back()}
                        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
                    >
                        {/* Back arrow */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-6 w-6"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold tracking-tight">File a ticket</h1>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-screen-sm px-3 pb-8 pt-4 sm:px-4">
                <div className="p-4 sm:p-6">
                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* from */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-slate-700">from</label>
                            <div className="pl-4 text-sm text-slate-900">: Sippakorn Thunyahan</div>
                        </div>

                        {/* topic */}
                        <div className="space-y-2">
                            <label htmlFor="topic" className="block text-sm font-semibold text-slate-700">
                                topic
                            </label>
                            <input
                                id="topic"
                                type="text"
                                inputMode="text"
                                placeholder="enter topic here..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full rounded-md border border-[#176A83]/60 bg-white px-3 py-2 text-[15px] outline-none placeholder:text-slate-400 focus:border-[#176A83] focus:ring-2 focus:ring-[#176A83]/30"
                            />
                        </div>

                        {/* details */}
                        <div className="space-y-2">
                            <label htmlFor="details" className="block text-sm font-semibold text-slate-700">
                                details
                            </label>
                            <textarea
                                id="details"
                                rows={10}
                                placeholder="enter details here..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full resize-y rounded-md border border-[#176A83] bg-[#F4F8FF] px-3 py-2 text-[15px] outline-none placeholder:text-slate-400 focus:border-[#176A83] focus:ring-2 focus:ring-[#176A83]/30"
                            />
                        </div>

                        {/* Submit (not visible in screenshot, but provided to make it functional) */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-md bg-[#0E4663] px-4 py-2 text-white shadow-sm hover:opacity-95 active:opacity-90 sm:w-auto"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
