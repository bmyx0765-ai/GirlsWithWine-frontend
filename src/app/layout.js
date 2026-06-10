import "./globals.css";
import ReduxProvider from "@/store/provider";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://girlswithwine.com"),
  manifest: "/manifest.json",

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

        <meta name="theme-color" content="#000000" />

        {/* CONTENT TYPE */}
        <meta
          httpEquiv="Content-Type"
          content="text/html; charset=UTF-8"
        />

        {/* GOOGLE SEARCH CONSOLE */}
        <meta
          name="google-site-verification"
          content="c09IAF3PnXkZnpQ57WLvYg8oXUsrQRuOZ5phxQS07Bs"
        />

        {/* BING VERIFICATION */}
        <meta
          name="msvalidate.01"
          content="55C6CD5F437B670268E8E861D770B55F"
        />

        {/* NORTON VERIFICATION */}
       <meta name="yandex-verification" content="c3db89ff1d1d4f32" />

        {/* FONT AWESOME */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        {/* JODIT EDITOR */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/jodit@4.7.6/es2021/jodit.min.css"
        />

        <script
          src="https://unpkg.com/jodit@4.7.6/es2021/jodit.min.js"
          defer
        ></script>

        {/* JSON-LD SCHEMA */}
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

        {/* GOOGLE ANALYTICS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3GDW8E8RJD"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-3GDW8E8RJD');
          `}
        </Script>

         {/* MICROSOFT CLARITY */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
        >
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);
                t.async=1;
                t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wt0dlejeoc");
          `}
        </Script>

        

      </head>

      <body>

        <ReduxProvider>

          <LayoutWrapper>
            {children}
          </LayoutWrapper>

        </ReduxProvider>

      </body>

    </html>
  );
}