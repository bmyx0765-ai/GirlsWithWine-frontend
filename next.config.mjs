/** @type {import('next').NextConfig} */

const nextConfig = {

  reactCompiler: true,

  /* =========================================
     CLOUDINARY REWRITE
  ========================================= */

  async rewrites() {

    return [

      {
        source: "/uploads/:path*",

        destination:
          "https://res.cloudinary.com/dd8zulgom/image/upload/:path*",
      },

    ];
  },

  /* =========================================
     NEXT IMAGE CONFIG
  ========================================= */

  images: {

    remotePatterns: [

      /* =========================================
         MAIN DOMAIN
      ========================================= */

      {
        protocol: "https",
        hostname: "girlswithwine.com",
        pathname: "/uploads/**",
      },

      /* =========================================
         CLOUDINARY
      ========================================= */

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },

      /* =========================================
         WORDPRESS BLOG
      ========================================= */

      {
        protocol: "https",
        hostname: "blog.girlswithwine.com",
        pathname: "/**",
      },

      /* =========================================
         WORDPRESS CDN
      ========================================= */

      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },

      /* =========================================
         GRAVATAR
      ========================================= */

      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },

      /* =========================================
         LOCALHOST DEV
      ========================================= */

      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },

    ],
  },

  /* =========================================
     PERFORMANCE
  ========================================= */

  compress: true,

  poweredByHeader: false,

  productionBrowserSourceMaps:
    false,
};

export default nextConfig;