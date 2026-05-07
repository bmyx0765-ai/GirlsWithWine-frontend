import "./globals.css";
import ReduxProvider from "@/store/provider";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://girlswithwine.com"),

  title:
    "VIP Escort Girls in India | Professional Call Girls Services Across India| GirlsWithWine",

  description:
    "Search for VIP escort services near you. 💕 Browse verified profiles with real photos, reviews, pricing, and location details. Discover trusted and professional call girls across India and worldwide on GirlsWithWine.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title:
      "VIP Escort Girls in India | Professional Call Girls Services Across India| GirlsWithWine",

    description:
      "Search for VIP escort services near you. 💕 Browse verified profiles with real photos, reviews, pricing, and location details. Discover trusted and professional call girls across India and worldwide on GirlsWithWine.",

    url: "https://girlswithwine.com",

    siteName: "Girls With Wine",

    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Girls With Wine",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "VIP Escort Girls in India | Professional Call Girls Services Across India| GirlsWithWine",
    description:
      "Search for VIP escort services near you. 💕 Browse verified profiles with real photos, reviews, pricing, and location details. Discover trusted and professional call girls across India and worldwide on GirlsWithWine.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="c09IAF3PnXkZnpQ57WLvYg8oXUsrQRuOZ5phxQS07Bs"
        />

        {/* External CSS */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        {/* Jodit Editor */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/jodit@4.7.6/es2021/jodit.min.css"
        />

        <script
          src="https://unpkg.com/jodit@4.7.6/es2021/jodit.min.js"
          defer
        ></script>

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Girls With Wine",
                  url: "https://girlswithwine.com",
                },
                {
                  "@type": "Organization",
                  name: "Girls With Wine",
                  url: "https://girlswithwine.com",
                  logo: "https://girlswithwine.com/icon.png",
                },
              ],
            }),
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3GDW8E8RJD"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3GDW8E8RJD');
          `}
        </Script>
      </head>

      <body>
        <ReduxProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}