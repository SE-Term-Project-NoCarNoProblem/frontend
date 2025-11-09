import { supabase } from "./supabase";

export default async function getGoogleSignInLink() {
	const { data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			skipBrowserRedirect: true,
			redirectTo: window.location.origin + "/redirect/google-oauth/",
		},
	});
	return data.url;
}
