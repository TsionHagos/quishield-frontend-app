/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sb.frontend.co",
      },
      {
        protocol: "https",
        hostname: "supabase.frontend.co",
      },
    ],
  },
};

export default nextConfig;
