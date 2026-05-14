/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rotcskgxgosmbfbvkuic.supabase.co",
      },
    ],
  },
};

export default nextConfig;
