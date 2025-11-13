"use client";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { fetchWithAuth } from "../lib/api";
import SuspendBanDashboard, { UserData } from "../components/SuspendBanDashboard";
import RoleToggle from "../components/RoleToggle";


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Array<UserData>>([]);
  const [role, setRole] = useState<"DRIVER" | "CUSTOMER">("DRIVER");

  useEffect(() => {
    // Simulate a search operation
    // In a real app, you would fetch results from an API
    // Here we just filter a static list for demonstration
    // For example purposes, we use a static list
    // In a real application, replace this with an API call
    async function fetchData() {
      try {
				const result = await fetchWithAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`
				);

				const apiResponse = await result.json();
				console.log("Data from API:", apiResponse);

      } catch {
        console.error("Failed to fetch data from API");
      }
    }

    // const allItems = ["Apple", "Banana", "Orange", "Grapes", "Pineapple", "Mango", "Strawberry", "Blueberry", "Watermelon"];
    const MockData: Array<UserData> = [
      { id: "12323", name: "John Doe", email: "test@gmail.com" , status: "Banned", rating: 4.5, role: "DRIVER" },
      { id: "123132323", name: "Jane Smith", email: "fdfdf@fdfdf.com", status: "Suspended", role: "CUSTOMER" },
      { id: "121-21212", name: "Alice Johnson", email: "fdfdfefef@fdfd.com" , status: "Active", rating: 5.0, role: "DRIVER" }
    ];


    const filtered = MockData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
    // fetchData();
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
