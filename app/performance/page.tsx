"use client";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { fetchWithAuth } from "../lib/api";
import SuspendBanDashboard, { UserData } from "../components/SuspendBanDashboard";
import RoleToggle from "../components/RoleToggle";


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allDrivers, setAllDrivers] = useState<Array<UserData>>([]);
  const [results, setResults] = useState<Array<UserData>>([]);
  const [role, setRole] = useState<"DRIVER" | "CUSTOMER">("DRIVER");

    useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`
        );

        const apiResponse = await result.json();
        console.log("Data from API:", apiResponse);
        setAllDrivers(apiResponse);
        setResults(apiResponse);
      } catch {
        console.error("Failed to fetch data from API");
      }
    }
    fetchData();
  }, [])
  useEffect(() => {


    const filtered = allDrivers.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
  }
  , [searchQuery]);

  return (
    <div className="mx-6">
      <SearchBar
        placeholder="Search for fruits..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="mb-4"
      />
      <RoleToggle value={role} onChange={setRole} />
      <SuspendBanDashboard users={results} role={role} />
    </div>
  );
}
