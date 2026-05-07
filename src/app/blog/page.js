import BlogClient from "@/components/BlogClient";

// ✅ SEO META
export const metadata = {
  title: "Latest Blogs | Girls With Wine",
  description:
    "Read latest blogs, insights and updates from Girls With Wine.",

  keywords: [
    "blogs",
    "latest blogs",
    "girls with wine blog",
    "news",
    "articles",
  ],

  openGraph: {
    title: "Latest Blogs | Girls With Wine",
    description: "Explore our latest blog posts and insights.",
    url: "https://girlswithwine.com/blog",
    siteName: "Girls With Wine",

    images: [
      {
        url: "https://girlswithwine.com/images/blog-banner.jpg",
        width: 1200,
        height: 630,
      },
    ],

    type: "website",
  },
};

export default function Page() {
  return <BlogClient />;
}