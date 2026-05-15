

import CityGirlsPage from "@/components/CityGirlsPage";
import GirlDetailsPage from "@/components/GirlDetailsPage";
import Hash404 from "@/components/Hash404";
import SubCityGirlsPage from "@/components/SubCityGirlsPage";




/* ================================================= */
/* ================= LAT LONG ====================== */
/* ================================================= */

async function getLatLong(cityName) {

  try {

    const API_KEY =
      process.env.OPENCAGE_API_KEY;

    if (!API_KEY || !cityName) {
      return null;
    }

    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${API_KEY}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (
      !data?.results ||
      data.results.length === 0
    ) {
      return null;
    }

    const result = data.results.find(
      (item) =>
        item?.components?.country ===
        "India"
    );

    if (!result) {
      return null;
    }

    return {
      latitude:
        result.geometry?.lat,
      longitude:
        result.geometry?.lng,
    };

  } catch (err) {

    

    return null;

  }
}

/* ================================================= */
/* ================= API URL ======================= */
/* ================================================= */

function getApiUrl() {

  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  );

}

/* ================================================= */
/* ================= FAQ SCHEMA ==================== */
/* ================================================= */

async function getFaqSchema(type, id) {

  try {

    if (!id) return null;

    let url = "";

    if (type === "city") {
      url = `${getApiUrl()}/api/faqs/city/${id}`;
    }

    else if (type === "subcity") {
      url = `${getApiUrl()}/api/faqs/subcity/${id}`;
    }

    else if (type === "girl") {
      url = `${getApiUrl()}/api/faqs/girl/${id}`;
    }

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    /* ================= NORMALIZE FAQS ================= */

    let faqList = [];

    // CASE 1
    // [{ faqs:[...] }]

    if (
      Array.isArray(data) &&
      data[0]?.faqs
    ) {

      faqList = data.flatMap(
        (item) => item?.faqs || []
      );

    }

    // CASE 2
    // { faqs:[...] }

    else if (data?.faqs) {

      faqList = data.faqs;

    }

    // CASE 3
    // direct faq array

    else if (
      Array.isArray(data)
    ) {

      faqList = data;

    }

    /* ================= FILTER ================= */

    faqList = faqList.filter((faq) => {

      return (
        faq?.question &&
        faq?.answer &&
        faq?.showOn?.[type] === true
      );

    });

    if (!faqList.length) {
      return null;
    }

    /* ================= FAQ SCHEMA ================= */

    return {

      "@context": "https://schema.org",

      "@type": "FAQPage",

      mainEntity: faqList.map((faq) => ({

        "@type": "Question",

        name: faq.question,

        acceptedAnswer: {

          "@type": "Answer",

          text: faq.answer,
        },

      })),
    };

  } catch (error) {

    console.log(
      "FAQ SCHEMA ERROR:",
      error
    );

    return null;

  }

}

/* ================================================= */
/* ================= CHECK SLUG ==================== */
/* ================================================= */

async function checkSlug(slug) {

  try {

    /* ================= GIRL ================= */

    const girlRes = await fetch(
      `${getApiUrl()}/api/girls/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (girlRes.ok) {

      const girlData =
        await girlRes.json();

      if (
        girlData &&
        girlData._id &&
        !girlData.message
      ) {

        return {
          type: "girl",
          data: girlData,
        };

      }

    }

    /* ================= CITY ================= */

    const cityRes = await fetch(
      `${getApiUrl()}/api/cities/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (cityRes.ok) {

      const cityData =
        await cityRes.json();

      if (
        cityData &&
        cityData.city &&
        cityData.city._id
      ) {

        return {
          type: "city",
          data: cityData,
        };

      }

    }

    /* ================= SUBCITY ================= */

    const subCityRes = await fetch(
      `${getApiUrl()}/api/subcities/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (subCityRes.ok) {

      const subCityData =
        await subCityRes.json();

      if (
        subCityData &&
        subCityData.subCity &&
        subCityData.subCity._id
      ) {

        return {
          type: "subcity",
          data: subCityData.subCity,
        };

      }

    }

    /* ================= INVALID ================= */

    return null;

  } catch (err) {

   

    return null;

  }

}

/* ================================================= */
/* ================= SEO =========================== */
/* ================================================= */

export async function generateMetadata({
  params,
}) {

  const { slug } =
    await params;

  const result =
    await checkSlug(slug);

  /* ================= NOT FOUND ================= */

  if (!result) {

    return {

      title:
        "404 Not Found",

      description:
        "Page not found",

      robots: {
        index: false,
        follow: false,
      },

      openGraph: {

        title:
          "404 Not Found",

        description:
          "Page not found",

        type:
          "website",
      },
    };

  }

  /* ================================================= */
  /* ================= CITY SEO ====================== */
  /* ================================================= */

 if (
  result.type ===
  "city"
) {

  const { city } =
    result.data;

  /* ================= CITY NAME ================= */

  const cityNameRaw =
    city?.mainCity ||
    city?.name ||
    slug;

  const cityName =
    cityNameRaw
      ?.split(" ")
      ?.map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      ?.join(" ");

  /* ================= PAGE URL ================= */

  const pageUrl =
    `https://girlswithwine.com/${slug}`;

  /* ================= IMAGE ================= */

  const imageUrl =
    city?.imageUrl ||
    city?.image ||
    "https://girlswithwine.com/images/girlswithwine.jpg";

  /* ================= SEO TITLE ================= */

  const seoTitle =
    city?.seo?.title ||
    city?.seoTitle ||
    city?.heading ||
    `${cityName} Escort Service`;

  /* ================= SEO DESCRIPTION ================= */

  const seoDescription =
    city?.seo?.description ||
    city?.seoDescription ||
    city?.subDescription ||
    `Book verified call girls and independent escorts in ${cityName} with private and 24/7 booking.`;

  /* ================= OG TITLE ================= */

  const ogTitle =
    city?.seo?.ogTitle ||
    city?.ogTitle ||
    seoTitle;

  /* ================= OG DESCRIPTION ================= */

  const ogDescription =
    city?.seo?.ogDescription ||
    city?.ogDescription ||
    seoDescription;

  /* ================= FACEBOOK TITLE ================= */

  const facebookTitle =
    city?.seo?.facebookTitle ||
    city?.facebookTitle ||
    ogTitle;

  /* ================= FACEBOOK DESCRIPTION ================= */

  const facebookDescription =
    city?.seo?.facebookDescription ||
    city?.facebookDescription ||
    ogDescription;

  /* ================= TWITTER TITLE ================= */

  const twitterTitle =
    city?.seo?.twitterTitle ||
    city?.twitterTitle ||
    ogTitle;

  /* ================= TWITTER DESCRIPTION ================= */

  const twitterDescription =
    city?.seo?.twitterDescription ||
    city?.twitterDescription ||
    ogDescription;

  /* ================= SEO KEYWORDS ================= */

  const seoKeywords =
    city?.seo?.seoKeywords ||
    city?.seoKeywords ||
    "";

  /* ================= CANONICAL ================= */

  const canonicalUrl =
    city?.seo?.canonical ||
    city?.canonical ||
    pageUrl;

  return {

    /* ================= SEO ================= */

    title:
      seoTitle,

    description:
      seoDescription,

    keywords:
      seoKeywords
        ? seoKeywords
          .split(",")
          .map((k) =>
            k.trim()
          )
        : [],

    alternates: {

      canonical:
        canonicalUrl,
    },

    /* ================= OPEN GRAPH ================= */

    openGraph: {

      title:
        facebookTitle,

      description:
        facebookDescription,

      url:
        canonicalUrl,

      siteName:
        "Girls With Wine",

      locale:
        "en_IN",

      type:
        "website",

      images: [

        {
          url:
            imageUrl,

          width: 1200,

          height: 630,

          alt:
            ogTitle,
        },
      ],
    },

    /* ================= TWITTER ================= */

    twitter: {

      card:
        "summary_large_image",

      title:
        twitterTitle,

      description:
        twitterDescription,

      images: [
        imageUrl,
      ],
    },

    /* ================= CUSTOM META ================= */

    other: {

      "facebook:title":
        facebookTitle,

      "facebook:description":
        facebookDescription,
    },

    /* ================= ROBOTS ================= */

    robots: {

      index: true,

      follow: true,
    },
  };
}

  /* ================================================= */
  /* ================= SUBCITY SEO =================== */
  /* ================================================= */


if (
  result.type ===
  "subcity"
) {

  const subCity =
    result.data;

  const pageUrl =
    `https://girlswithwine.com/${slug}`;

  /* ================= SEO TITLE ================= */

  const seoTitle =
    subCity?.seoTitle ||
    subCity?.heading ||
    "Girls With Wine";

  /* ================= SEO DESCRIPTION ================= */

  const seoDescription =
    subCity?.seoDescription ||
    subCity?.subDescription ||
    "Premium escort service";

  /* ================= OG TITLE ================= */

  const ogTitle =
    subCity?.seo?.ogTitle ||
    subCity?.ogTitle ||
    seoTitle;

  /* ================= OG DESCRIPTION ================= */

  const ogDescription =
    subCity?.seo?.ogDescription ||
    subCity?.ogDescription ||
    seoDescription;

  /* ================= TWITTER TITLE ================= */

  const twitterTitle =
    subCity?.seo?.twitterTitle ||
    subCity?.twitterTitle ||
    ogTitle;

  /* ================= TWITTER DESCRIPTION ================= */

  const twitterDescription =
    subCity?.seo?.twitterDescription ||
    subCity?.twitterDescription ||
    ogDescription;

  /* ================= FACEBOOK TITLE ================= */

  const facebookTitle =
    subCity?.seo?.facebookTitle ||
    subCity?.facebookTitle ||
    ogTitle;

  /* ================= FACEBOOK DESCRIPTION ================= */

  const facebookDescription =
    subCity?.seo?.facebookDescription ||
    subCity?.facebookDescription ||
    ogDescription;

  /* ================= CANONICAL ================= */

  const canonicalUrl =
    subCity?.canonical ||
    pageUrl;

  /* ================= IMAGE ================= */

  const imageUrl =
    subCity?.imageUrl ||
    subCity?.image ||
    "https://girlswithwine.com/images/girlswithwine.jpg";

  return {

    /* ================= SEO ================= */

    title:
      seoTitle,

    description:
      seoDescription,

    alternates: {

      canonical:
        canonicalUrl,
    },

    /* ================= OPEN GRAPH ================= */

    openGraph: {

      title:
        facebookTitle ||

        ogTitle,

      description:
        facebookDescription ||

        ogDescription,

      url:
        canonicalUrl,

      siteName:
        "Girls With Wine",

      locale:
        "en_IN",

      type:
        "website",

      images: [

        {
          url:
            imageUrl,

          width: 1200,

          height: 630,

          alt:
            ogTitle,
        },
      ],
    },

    /* ================= TWITTER ================= */

    twitter: {

      card:
        "summary_large_image",

      title:
        twitterTitle,

      description:
        twitterDescription,

      images: [
        imageUrl,
      ],
    },

    /* ================= EXTRA META ================= */

    other: {

      "og:title":
        ogTitle,

      "og:description":
        ogDescription,

      "twitter:title":
        twitterTitle,

      "twitter:description":
        twitterDescription,

      "facebook:title":
        facebookTitle,

      "facebook:description":
        facebookDescription,
    },

    /* ================= ROBOTS ================= */

    robots: {

      index: true,

      follow: true,
    },
  };
}

  /* ================================================= */
  /* ================= GIRL SEO ====================== */
  /* ================================================= */

 if (
  result.type ===
  "girl"
) {

  const girl =
    result.data;

  const pageUrl =
    `https://girlswithwine.com/${slug}`;

  /* ================= SEO TITLE ================= */

  const seoTitle =
    girl?.seo?.title ||
    girl?.seoTitle ||
    girl?.heading ||
    "Girls With Wine";

  /* ================= SEO DESCRIPTION ================= */

  const seoDescription =
    girl?.seo?.description ||
    girl?.seoDescription ||
    girl?.heading ||
    "Premium escort profile";

  /* ================= OG TITLE ================= */

  const ogTitle =
    girl?.seo?.ogTitle ||
    girl?.ogTitle ||
    seoTitle;

  /* ================= OG DESCRIPTION ================= */

  const ogDescription =
    girl?.seo?.ogDescription ||
    girl?.ogDescription ||
    seoDescription;

  /* ================= FACEBOOK TITLE ================= */

  const facebookTitle =
    girl?.seo?.facebookTitle ||
    girl?.facebookTitle ||
    ogTitle;

  /* ================= FACEBOOK DESCRIPTION ================= */

  const facebookDescription =
    girl?.seo?.facebookDescription ||
    girl?.facebookDescription ||
    ogDescription;

  /* ================= TWITTER TITLE ================= */

  const twitterTitle =
    girl?.seo?.twitterTitle ||
    girl?.twitterTitle ||
    ogTitle;

  /* ================= TWITTER DESCRIPTION ================= */

  const twitterDescription =
    girl?.seo?.twitterDescription ||
    girl?.twitterDescription ||
    ogDescription;

  /* ================= CANONICAL ================= */

  const canonicalUrl =
    girl?.seo?.canonical ||
    girl?.canonical ||
    pageUrl;

  /* ================= IMAGE ================= */

  const imageUrl =
    girl?.imageUrl ||
    girl?.profileImage ||
    girl?.image ||
    "https://girlswithwine.com/images/girlswithwine.jpg";

  return {

    /* ================= SEO ================= */

    title:
      seoTitle,

    description:
      seoDescription,

    alternates: {

      canonical:
        canonicalUrl,
    },

    /* ================= OPEN GRAPH ================= */

    openGraph: {

      title:
        facebookTitle,

      description:
        facebookDescription,

      url:
        canonicalUrl,

      siteName:
        "Girls With Wine",

      locale:
        "en_IN",

      type:
        "website",

      images: [

        {
          url:
            imageUrl,

          width: 1200,

          height: 630,

          alt:
            ogTitle,
        },
      ],
    },

    /* ================= TWITTER ================= */

    twitter: {

      card:
        "summary_large_image",

      title:
        twitterTitle,

      description:
        twitterDescription,

      images: [
        imageUrl,
      ],
    },

    /* ================= CUSTOM META ================= */

    other: {

      "facebook:title":
        facebookTitle,

      "facebook:description":
        facebookDescription,

      "og:title":
        ogTitle,

      "og:description":
        ogDescription,

      "twitter:title":
        twitterTitle,

      "twitter:description":
        twitterDescription,
    },

    /* ================= ROBOTS ================= */

    robots: {

      index: true,

      follow: true,
    },
  };
}

return {};
}

/* ================================================= */
/* ================= PAGE ========================== */
/* ================================================= */




export default async function Page({
  params,
}) {

  const { slug } = await params;

  /* ================= INVALID URL ================= */

  const decodedSlug =
    decodeURIComponent(slug || "");

  if (
    decodedSlug.includes("#") ||
    decodedSlug.includes("%23") ||
    decodedSlug.includes("?") ||
    decodedSlug.includes("&")
  ) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-white">

        <h1 className="text-4xl md:text-6xl font-black text-slate-900">
          404 Not Found
        </h1>

      </div>

    );

  }

  /* ================= CHECK SLUG ================= */

  const result =
    await checkSlug(decodedSlug);

  /* ================= 404 ================= */

  
  /* ================================================= */
  /* ================= CITY PAGE ===================== */
  /* ================================================= */


  if (result.type === "city") {

    const { city } =
      result.data;

    /* ================================================= */
    /* ================= DEBUG RESPONSE ================ */
    /* ================================================= */



    const faqSchema =
      await getFaqSchema(
        "city",
        city?._id
      );

    let latitude =
      city?.latitude;

    let longitude =
      city?.longitude;

    const cityNameRaw =
      city?.mainCity ||
      city?.name ||
      slug;

    const cityName =
      cityNameRaw
        ?.split(" ")
        ?.map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        ?.join(" ");

    if (
      !latitude ||
      !longitude
    ) {

      const geo =
        await getLatLong(
          cityName
        );

      if (geo) {

        latitude =
          geo.latitude;

        longitude =
          geo.longitude;

      }
    }

    /* ================================================= */
    /* ================= URL =========================== */
    /* ================================================= */

    const pageUrl =
      `https://girlswithwine.com/${slug}`;

    /* ================================================= */
    /* ================= IMAGE ========================= */
    /* ================================================= */

    const imageUrl =
      city?.imageUrl ||
      city?.image ||
      "";

    /* ================================================= */
    /* ================= SEO DATA ====================== */
    /* ================================================= */

    const canonicalUrl =
      city?.seo?.canonical ||
      city?.canonical ||
      pageUrl ||
      "";

    const seoTitle =
      city?.seo?.title ||
      city?.seoTitle ||
      city?.heading ||
      "";

    const seoDescription =
      city?.seo?.description ||
      city?.seoDescription ||
      city?.subDescription ||
      "";

    const seoKeywords =
      city?.seo?.seoKeywords ||
      city?.seoKeywords ||
      "";

    /* ================================================= */
    /* ================= SERVICE TYPE ================== */
    /* ================================================= */

    const serviceTypes =
      city?.serviceType ||
      city?.seo?.serviceType ||
      "";


    /* ================================================= */
    /* ================= BREADCRUMB ==================== */
    /* ================================================= */

    const breadcrumbSchema = {

      "@context":
        "https://schema.org",

      "@type":
        "BreadcrumbList",

      itemListElement: [

        {
          "@type":
            "ListItem",

          position: 1,

          name: "Home",

          item:
            "https://girlswithwine.com/",
        },

        {
          "@type":
            "ListItem",

          position: 2,

          ...(cityName && {
            name:
              cityName,
          }),

          ...(canonicalUrl && {
            item:
              canonicalUrl,
          }),
        },
      ],
    };

    /* ================================================= */
    /* ================= LOCAL BUSINESS ================ */
    /* ================================================= */

    const localBusinessSchema = {

      "@context":
        "https://schema.org",

      "@type":
        "LocalBusiness",

      ...(seoTitle && {
        name:
          seoTitle,
      }),

      ...(canonicalUrl && {
        url:
          canonicalUrl,
      }),

      ...(imageUrl && {
        image:
          imageUrl,
      }),

      telephone:
        "+91-XXXXXXXXXX",

      priceRange:
        "₹2999 - ₹19999",

      ...(seoDescription && {
        description:
          seoDescription,
      }),

      ...(seoKeywords && {
        keywords:
          seoKeywords,
      }),

      address: {

        "@type":
          "PostalAddress",

        ...(cityName && {
          addressLocality:
            cityName,
        }),

        ...(city?.state ||
          city?.stateName
          ? {
            addressRegion:
              city?.state ||
              city?.stateName,
          }
          : {}),

        addressCountry:
          "IN",
      },

      ...(latitude &&
        longitude && {
        geo: {

          "@type":
            "GeoCoordinates",

          latitude,

          longitude,
        },
      }),

      openingHours:
        "Mo-Su 00:00-23:59",

      ...(canonicalUrl && {
        sameAs: [
          canonicalUrl,
        ],
      }),
    };

    /* ================================================= */
    /* ================= SERVICE SCHEMA ================ */
    /* ================================================= */

    const serviceSchema = {

      "@context":
        "https://schema.org",

      "@type":
        "Service",

      ...(seoTitle && {
        name:
          seoTitle,
      }),

      provider: {

        "@type":
          "Organization",

        name:
          "Girls With Wine",

        url:
          "https://girlswithwine.com/",
      },

      ...(canonicalUrl && {
        url:
          canonicalUrl,
      }),

      areaServed: {

        "@type":
          "City",

        ...(cityName && {
          name:
            cityName,
        }),
      },

      ...(serviceTypes && {
        serviceType:
          serviceTypes,
      }),

      ...(seoDescription && {
        description:
          seoDescription,
      }),

      ...(seoKeywords && {
        keywords:
          seoKeywords,
      }),

      offers: {

        "@type":
          "AggregateOffer",

        priceCurrency:
          "INR",

        lowPrice:
          "2999",

        highPrice:
          "19999",
      },
    };

    return (
      <>
       <Hash404 />

        {/* FAQ SCHEMA */}

        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  faqSchema
                ),
            }}
          />
        )}

        {/* BREADCRUMB SCHEMA */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                breadcrumbSchema
              ),
          }}
        />

        {/* LOCAL BUSINESS SCHEMA */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                localBusinessSchema
              ),
          }}
        />

        {/* SERVICE SCHEMA */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                serviceSchema
              ),
          }}
        />

        {/* GEO */}

        {latitude &&
          longitude && (
            <>
              <meta
                name="geo.region"
                content="IN"
              />

              <meta
                name="geo.placename"
                content={
                  cityName
                }
              />

              <meta
                name="geo.position"
                content={`${latitude};${longitude}`}
              />

              <meta
                name="ICBM"
                content={`${latitude}, ${longitude}`}
              />
            </>
          )}



        <CityGirlsPage
          params={{
            cityName:
              decodedSlug,
          }}
        />

      </>
    );
  }

  /* ================================================= */
  /* ================= SUBCITY PAGE ================== */
  /* ================================================= */

  if (
    result.type ===
    "subcity"
  ) {

    const faqSchema =
      await getFaqSchema(
        "subcity",
        result.data?._id
      );

    return (
      <>
      <Hash404 />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  faqSchema
                ),
            }}
          />
        )}

        <SubCityGirlsPage
          data={
            result.data
          }
        />
      </>
    );

  }

  /* ================================================= */
  /* ================= GIRL PAGE ===================== */
  /* ================================================= */

  if (
    result.type ===
    "girl"
  ) {

    const faqSchema =
      await getFaqSchema(
        "girl",
        result.data?._id
      );

    return (
      <>
      <Hash404 />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  faqSchema
                ),
            }}
          />
        )}

        <GirlDetailsPage
          data={
            result.data
          }
        />
      </>
    );

  }


  if (!result) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-white">

        <h1 className="text-4xl md:text-6xl font-black text-slate-900">
          404 Not Found
        </h1>

      </div>

    );

  }
  /* ================================================= */
  /* ================= FALLBACK ====================== */
  /* ================================================= */

  return (

    <div className="min-h-screen flex items-center justify-center bg-white">

      <h1 className="text-4xl md:text-6xl font-black text-slate-900">
        404 Not Found
      </h1>

    </div>

  );
}
