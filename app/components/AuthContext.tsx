"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/api";

type UserStatus = "suspended" | "banned" | "active" | null;

interface AuthContextType {
	userStatus: UserStatus;
	suspendedTime?: number;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [userStatus, setUserStatus] = useState<UserStatus>(null);
	const [suspendedTime, setSuspendedTime] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserStatus = async () => {
			setIsLoading(true);
			try {
				// const result = await fetchWithAuth(
				//   `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`
				// );
				// const apiResponse = await result.json();
				// setUserStatus(apiResponse.data.status);
				// setSuspendedTime(apiResponse.data.suspended_time);
				//Mock
				setUserStatus("suspended"); // Change this value to test different statuses
				setSuspendedTime(3600000); // Mock suspended time in ms
				setIsLoading(false);
			} catch (error) {
				setUserStatus(null);
				setIsLoading(false);
				console.error("Error fetching user status:", error);
			}
		};

		fetchUserStatus();
	}, []);

	return (
		<AuthContext.Provider value={{ userStatus, suspendedTime, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
