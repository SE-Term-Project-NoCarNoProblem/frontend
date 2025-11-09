import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "bgbuvqwurphsvzonveen.supabase.co",
				port: "",
				pathname: "/storage/v1/object/public/profile_pic/**",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	output: "standalone",
};

export default nextConfig;
