"use client";

import React, { useState, useEffect } from "react";
import { getStoredConsent, setStoredConsent } from "../hooks/useCookieConsent";

export function CookieBanner() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  const handleConsent = (status: "accepted" | "denied") => {
    setStoredConsent(status);
    setConsent(status);
  };

  if (consent) return null;

  return (
    <div className="fixed bottom-0 w-full bg-white text-[#0E4663] p-4 flex justify-between items-center">
      <p>This site uses cookies to improve your experience.</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleConsent("accepted")}
          className="bg-[#0E4663] text-white px-3 py-1 rounded hover:bg-[#0c3a4e] transition cursor-pointer"
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent("denied")}
          className="bg-[#0E4663] text-white px-3 py-1 rounded hover:bg-[#0c3a4e] transition cursor-pointer"
        >
          Deny
        </button>
      </div>
    </div>
  );
}
