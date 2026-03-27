/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // 🔹 LOCAL (development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },

      // 🔥 PRODUCTION (IMPORTANT)
      {
        protocol: "https",
        hostname: "api4.girlswithwine.in",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;