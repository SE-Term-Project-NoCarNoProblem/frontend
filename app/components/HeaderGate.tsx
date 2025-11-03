"use client";
import { usePathname } from "next/navigation";

const HIDE = [
  "/hooks",
  "/redirect/google-oauth",
  "/ride-request",       // treat as prefix
  "/driver-en-route",  // treat as prefix
  "/location"
];

function shouldHide(pathname: string) {
  return HIDE.some(p => pathname === p || pathname.startsWith(p + "/"));
}

export default function HeaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (shouldHide(pathname)) return null;
  return <>{children}</>;
}
