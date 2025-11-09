"use client";

import { useAuth } from "./AuthContext";
import { ReactNode, useEffect } from "react";
import SuspendModal from "./SuspendModal";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
	const { userStatus, suspendedTime, isLoading } = useAuth();
	console.log(userStatus);
	if (isLoading) {
		return <div>Loading...</div>;
	}
	console.log(isLoading);

	if (userStatus === null || userStatus === undefined) {
		return <div>Error loading user status.</div>;
	}

	const modalOpen = userStatus !== "active";

	// return (
	//   <>
	//     {(userStatus === 'active') ? (
	//       // <>{children}</>
	//       <>test</>
	//     ) : (
	//       <>
	//         <div className="blur-sm-filter">{children}</div>
	//         <SuspendModal userStatus={userStatus} suspendedTime={suspendedTime} />
	//       </>
	//     )}
	//   </>
	// );
	return (
		<>
			<div
				className="blur-sm-filter"
				{...(modalOpen ? { inert: true as any } : {})} // disables focus & clicks behind modal
			>
				{children}
			</div>

			{modalOpen && (
				<SuspendModal userStatus={userStatus} suspendedTime={suspendedTime} />
			)}
		</>
	);
}
