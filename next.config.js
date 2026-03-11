/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.imagin.studio", "img.icons8.com", "cdn.worldvectorlogo.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.imagin.studio",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "cdn.worldvectorlogo.com",
      },
    ],
  },
};

module.exports = nextConfig;
