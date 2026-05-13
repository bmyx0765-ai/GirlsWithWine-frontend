/** @type {import('next').NextConfig} */

const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [

      /* ================= LOCAL ================= */

      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },

      /* ================= API SERVER ================= */

      {
        protocol: "https",
        hostname: "api4.girlswithwine.in",
        pathname: "/uploads/**",
      },

      /* ================= WORDPRESS BLOG ================= */

      {
        protocol: "https",
        hostname: "blog.girlswithwine.com",
        pathname: "/**",
      },

      /* ================= WORDPRESS CDN ================= */

      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },

      /* ================= GRAVATAR ================= */

      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },

      /* ================= MAIN WEBSITE ================= */

      {
        protocol: "https",
        hostname: "girlswithwine.com",
        pathname: "/**",
      },

    ],
  },
};

export default nextConfig;