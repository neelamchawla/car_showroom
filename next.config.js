/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Netlify IPX can return 500 for some remote/local assets;
    // serve image URLs directly to avoid runtime optimizer failures.
    unoptimized: true,
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
