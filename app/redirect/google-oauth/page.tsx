'use client';
import { fetchWithAuth } from "@/app/lib/api";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function GoogleOAuthRedirectPage() {
	// const searchParams = useSearchParams()

	useEffect(() => {
		// const token = searchParams.get('access_token'); // weird return url from supabase...
		const token = new URLSearchParams(window.location.href.split('#')[1]).get('access_token');
		localStorage.setItem('token', token || '');

		fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/get_status`).then(async (res) => {
			const data = await res.json();
			if (data.status === 'requires-setup') {
				redirect('/setup-account')
			} else {
				redirect('/landing-page')
			}
		})
	});

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-2xl text-black font-bold mb-4">Redirecting...</h1>
		</div>
	);
}