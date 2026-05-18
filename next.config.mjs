/** @type {import('next').NextConfig} */

const nextConfig = {

  reactCompiler: true,

  async rewrites() {

    return [

      {
        source: "/uploads/:path*",

        destination:
          "https://res.cloudinary.com/dd8zulgom/image/upload/:path*",
      },

    ];
  },

  images: {

    remotePatterns: [

      {
        protocol: "https",
        hostname: "girlswithwine.com",
        pathname: "/uploads/**",
      },

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "blog.girlswithwine.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },

    ],
  },
};

export default nextConfig;