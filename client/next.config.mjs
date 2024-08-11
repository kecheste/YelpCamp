/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    // remotePatterns: ["https://res.cloudinary.com"],
  },
};

export default nextConfig;
