// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactCompiler: true,

//   images: {
//     remotePatterns: [
//       // 🔹 LOCAL (development)
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "5000",
//         pathname: "/uploads/**",
//       },

//       // 🔥 PRODUCTION (IMPORTANT)
//       {
//         protocol: "https",
//         hostname: "api4.girlswithwine.in",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;





/** @type {import('next').NextConfig} */

const nextConfig = {

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  productionBrowserSourceMaps: false,

  reactCompiler: true,

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  images: {

    formats: ["image/avif", "image/webp"],

    remotePatterns: [

      // =========================
      // LOCAL DEVELOPMENT
      // =========================
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },

      // =========================
      // PRODUCTION API
      // =========================
      {
        protocol: "https",
        hostname: "api4.girlswithwine.in",
        pathname: "/uploads/**",
      },

    ],
  },

};

export default nextConfig;