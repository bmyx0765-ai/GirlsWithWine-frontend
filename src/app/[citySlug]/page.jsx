import { cache } from "react";
import CityGirlsPage from "@/components/CityGirlsPage";
import Hash404 from "@/components/Hash404";

export const revalidate = 300;

const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://girlswithwinebackend.vercel.app";

const FETCH_OPTIONS = {
  cache: "force-cache",
  next: {
    revalidate: 300,
  },
};

/* ============================================
   COMMON FETCH
============================================ */

async function fetchJSON(url) {
  try {
    const response = await fetch(url, FETCH_OPTIONS);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

/* ============================================
   CHECK CITY SLUG
============================================ */

export const checkSlug = cache(async (slug) => {
  try {
    if (!slug) return null;

    let cleanSlug = slug;

    try {
      cleanSlug = decodeURIComponent(slug);
    } catch {
      cleanSlug = slug;
    }

    cleanSlug = cleanSlug.trim().toLowerCase();

    if (!cleanSlug) {
      return null;
    }

    const cityData = await fetchJSON(
      `${API_URL}/api/cities/${encodeURIComponent(cleanSlug)}`
    );

    if (!cityData?.city?._id) {
      return null;
    }

    return {
      type: "city",
      data: cityData,
    };
  } catch (error) {
    console.error("checkSlug Error:", error);
    return null;
  }
});

/* ============================================
   FAQ SCHEMA
============================================ */

async function getFaqSchema(cityId) {
  if (!cityId) {
    return {
      visibleFaqs: [],
      schema: null,
    };
  }

  try {
    const baseUrl = `${API_URL}/api/faqs/visibility?type=city&cityId=${cityId}`;

    const [visibleData, hiddenData] = await Promise.all([
      fetchJSON(`${baseUrl}&visible=true`),
      fetchJSON(`${baseUrl}&visible=false`),
    ]);

    const extractFaqs = (data = {}) =>
      (data.faqs ?? [])
        .flatMap((group) => {
          if (Array.isArray(group?.faqs)) {
            return group.faqs;
          }

          return group?.question && group?.answer
            ? [group]
            : [];
        })
        .filter(
          ({ question, answer }) =>
            question?.trim() && answer?.trim()
        );

    const visibleFaqs = extractFaqs(visibleData);
    const allFaqs = [
      ...visibleFaqs,
      ...extractFaqs(hiddenData),
    ];

    if (!allFaqs.length) {
      return {
        visibleFaqs,
        schema: null,
      };
    }

    return {
      visibleFaqs,

      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",

        mainEntity: allFaqs.map(
          ({ question, answer }) => ({
            "@type": "Question",

            name: question,

            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          })
        ),
      },
    };
  } catch (error) {
    console.error("FAQ Schema Error:", error);

    return {
      visibleFaqs: [],
      schema: null,
    };
  }
}

/* ============================================
   404 PAGE
============================================ */

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <h1 className="text-4xl font-black text-slate-900 md:text-6xl">
        404 Not Found
      </h1>
    </main>
  );
}


/* ============================================
   HELPER
============================================ */

function formatCityName(city, slug = "") {
  const cityName = city?.mainCity || city?.name || slug;

  return cityName
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

/* ============================================
   PAGE
============================================ */

export default async function Page({ params }) {
  const { citySlug } = await params;

  const slug = decodeURIComponent(citySlug || "")
    .trim()
    .toLowerCase();

  if (!slug || /#|%23|\?|&/.test(slug)) {
    return <NotFoundPage />;
  }

  /* ===========================
     FETCH CITY
  =========================== */

  const result = await checkSlug(slug);

  if (!result?.data?.city) {
    return <NotFoundPage />;
  }

  const city = result.data.city;

  /* ===========================
     FETCH FAQ (Parallel)
  =========================== */

  const faqPromise = getFaqSchema(city._id);

  const {
    _id,
    latitude,
    longitude,
    seo = {},
    canonical,
    seoTitle,
    seoDescription,
    seoKeywords,
    heading,
    subDescription,
    serviceType,
    state,
    stateName,
  } = city;

  const cityName = formatCityName(city, slug);

  const pageUrl = `https://girlswithwine.com/${slug}`;

  const IMAGE_URL =
    "https://girlswithwine.com/images/girlswithwine.jpg";

  const canonicalUrl =
    seo.canonical ||
    canonical ||
    pageUrl;

  const finalTitle =
    seo.title ||
    seoTitle ||
    heading ||
    `${cityName} Escort Service`;

  const finalDescription =
    seo.description ||
    seoDescription ||
    subDescription ||
    `Book verified call girls and escorts in ${cityName}.`;

  const finalKeywords =
    seo.seoKeywords ||
    seoKeywords ||
    "";

  const finalServiceType =
    seo.serviceType ||
    serviceType ||
    "";

  /* ===========================
     WAIT FAQ
  =========================== */

  const { schema: faqJson } =
    await faqPromise;

  /* ===========================
     JSON-LD
  =========================== */

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://girlswithwine.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: cityName,
          item: canonicalUrl,
        },
      ],
    },

    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",

      name: finalTitle,
      url: canonicalUrl,
      image: IMAGE_URL,

      telephone: "+91-XXXXXXXXXX",

      description: finalDescription,

      keywords: finalKeywords,

      openingHours: "Mo-Su 00:00-23:59",

      priceRange: "₹2999 - ₹19999",

      sameAs: [canonicalUrl],

      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: state || stateName || "",
        addressCountry: "IN",
      },

      ...(latitude &&
        longitude && {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }),
    },

    {
      "@context": "https://schema.org",
      "@type": "Service",

      name: finalTitle,

      url: canonicalUrl,

      description: finalDescription,

      keywords: finalKeywords,

      serviceType: finalServiceType,

      provider: {
        "@type": "Organization",
        name: "Girls With Wine",
        url: "https://girlswithwine.com",
      },

      areaServed: {
        "@type": "City",
        name: cityName,
      },

      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "2999",
        highPrice: "19999",
      },
    },
  ];

  return (
    <>
      <Hash404 />

      {faqJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJson),
          }}
        />
      )}

      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

      {latitude && longitude && (
        <>
          <meta
            name="geo.region"
            content="IN"
          />

          <meta
            name="geo.placename"
            content={cityName}
          />

          <meta
            name="geo.position"
            content={`${latitude};${longitude}`}
          />

          <meta
            name="ICBM"
            content={`${latitude},${longitude}`}
          />
        </>
      )}

      <CityGirlsPage
        params={{
          cityName: slug,
        }}
      />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { citySlug } = await params;

  const slug = decodeURIComponent(citySlug || "")
    .trim()
    .toLowerCase();

  if (!slug || /#|%23|\?|&/.test(slug)) {
    return {
      title: "404 Not Found",
      description: "Page not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const result = await checkSlug(slug);

  if (!result?.data?.city) {
    return {
      title: "404 Not Found",
      description: "Page not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const city = result.data.city;

  const {
    seo = {},
    canonical,
    seoTitle,
    seoDescription,
    seoKeywords,
    heading,
    subDescription,
    ogTitle,
    ogDescription,
    facebookTitle,
    facebookDescription,
    twitterTitle,
    twitterDescription,
  } = city;

  const pageUrl = `https://girlswithwine.com/${slug}`;
  const imageUrl = "https://girlswithwine.com/images/girlswithwine.jpg";

  const title =
    seo.title ||
    seoTitle ||
    heading ||
    "Girls With Wine";

  const description =
    seo.description ||
    seoDescription ||
    subDescription ||
    heading ||
    "Premium escort service";

  const finalOgTitle =
    seo.ogTitle ||
    ogTitle ||
    title;

  const finalOgDescription =
    seo.ogDescription ||
    ogDescription ||
    description;

  const finalFacebookTitle =
    seo.facebookTitle ||
    facebookTitle ||
    finalOgTitle;

  const finalFacebookDescription =
    seo.facebookDescription ||
    facebookDescription ||
    finalOgDescription;

  const finalTwitterTitle =
    seo.twitterTitle ||
    twitterTitle ||
    finalOgTitle;

  const finalTwitterDescription =
    seo.twitterDescription ||
    twitterDescription ||
    finalOgDescription;

  const canonicalUrl =
    seo.canonical ||
    canonical ||
    pageUrl;

  return {
    title,
    description,

    keywords:
      seo.seoKeywords ||
      seoKeywords ||
      undefined,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: finalOgTitle,
      description: finalOgDescription,
      url: canonicalUrl,
      siteName: "Girls With Wine",
      locale: "en_IN",
      type: "website",

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: finalOgTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: finalTwitterTitle,
      description: finalTwitterDescription,
      images: [imageUrl],
    },

    other: {
      "og:title": finalOgTitle,
      "og:description": finalOgDescription,

      "facebook:title": finalFacebookTitle,
      "facebook:description": finalFacebookDescription,

      "twitter:title": finalTwitterTitle,
      "twitter:description": finalTwitterDescription,
    },
  };
}