/* ================================================= */
/* ================= IMPORTS ======================= */
/* ================================================= */

import { cache } from "react";

import CityGirlsPage from "@/components/CityGirlsPage";
import GirlDetailsPage from "@/components/GirlDetailsPage";
import Hash404 from "@/components/Hash404";
import SubCityGirlsPage from "@/components/SubCityGirlsPage";

/* ================================================= */
/* ================= FETCH CONFIG ================== */
/* ================================================= */

const fetchConfig = {
  next: {
    revalidate: 3600,
  },
};

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
/* ================= LAT LONG ====================== */
/* ================================================= */

const getLatLong = cache(
  async function getLatLong(cityName) {

    try {

      const API_KEY =
        process.env.OPENCAGE_API_KEY;

      if (
        !API_KEY ||
        !cityName
      ) {

        return null;

      }

      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${API_KEY}`,
        fetchConfig
      );

      if (!res.ok) {
        return null;
      }

      const data =
        await res.json();

      if (
        !data?.results ||
        data.results.length === 0
      ) {

        return null;

      }

      const result =
        data.results.find(
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
);

/* ================================================= */
/* ================= FAQ SCHEMA ==================== */
/* ================================================= */

const getFaqSchema = cache(
  async function getFaqSchema(type, id) {

    try {

      if (!id) {

        return {

          visibleFaqs: [],
          schema: null,

        };

      }

      let trueUrl = "";
      let falseUrl = "";

      /* ================= CITY ================= */

      if (type === "city") {

        trueUrl =
          `${getApiUrl()}/api/faqs/visibility?type=city&visible=true&cityId=${id}`;

        falseUrl =
          `${getApiUrl()}/api/faqs/visibility?type=city&visible=false&cityId=${id}`;

      }

      /* ================= SUBCITY ================= */

      else if (
        type === "subcity"
      ) {

        trueUrl =
          `${getApiUrl()}/api/faqs/visibility?type=subcity&visible=true&subCityId=${id}`;

        falseUrl =
          `${getApiUrl()}/api/faqs/visibility?type=subcity&visible=false&subCityId=${id}`;

      }

      /* ================= GIRL ================= */

      else if (
        type === "girl"
      ) {

        trueUrl =
          `${getApiUrl()}/api/faqs/visibility?type=girl&visible=true&girlId=${id}`;

        falseUrl =
          `${getApiUrl()}/api/faqs/visibility?type=girl&visible=false&girlId=${id}`;

      }

      const [
        trueRes,
        falseRes,
      ] = await Promise.all([

        fetch(
          trueUrl,
          fetchConfig
        ),

        fetch(
          falseUrl,
          fetchConfig
        ),

      ]);

      if (
        !trueRes.ok &&
        !falseRes.ok
      ) {

        return {

          visibleFaqs: [],
          schema: null,

        };

      }

      const trueData =
        trueRes.ok
          ? await trueRes.json()
          : {};

      const falseData =
        falseRes.ok
          ? await falseRes.json()
          : {};

      const extractFaqs =
        (data) => {

          let faqList = [];

          if (
            Array.isArray(
              data?.faqs
            )
          ) {

            faqList =
              data.faqs.flatMap(
                (group) => {

                  if (
                    Array.isArray(
                      group?.faqs
                    )
                  ) {

                    return group.faqs;

                  }

                  if (
                    group?.question &&
                    group?.answer
                  ) {

                    return [group];

                  }

                  return [];

                }
              );

          }

          else if (
            Array.isArray(data)
          ) {

            faqList = data;

          }

          faqList =
            faqList.filter(
              (faq) => {

                return (

                  faq &&

                  typeof faq.question ===
                    "string" &&

                  faq.question.trim() !==
                    "" &&

                  typeof faq.answer ===
                    "string" &&

                  faq.answer.trim() !==
                    ""

                );

              }
            );

          return faqList;

        };

      const visibleFaqs =
        extractFaqs(
          trueData
        );

      const hiddenFaqs =
        extractFaqs(
          falseData
        );

      const allFaqs = [

        ...visibleFaqs,

        ...hiddenFaqs,

      ];

      if (!allFaqs.length) {

        return {

          visibleFaqs: [],
          schema: null,

        };

      }

      const schema = {

        "@context":
          "https://schema.org",

        "@type":
          "FAQPage",

        mainEntity:
          allFaqs.map(
            (faq) => ({

              "@type":
                "Question",

              name:
                faq.question,

              acceptedAnswer: {

                "@type":
                  "Answer",

                text:
                  faq.answer,

              },

            })
          ),

      };

      return {

        visibleFaqs,
        schema,

      };

    } catch (error) {

      return {

        visibleFaqs: [],
        schema: null,

      };

    }
  }
);

/* ================================================= */
/* ================= CHECK SLUG ==================== */
/* ================================================= */

const checkSlug = cache(
  async function checkSlug(slug) {

    try {

      const [
        girlRes,
        cityRes,
        subCityRes,
      ] = await Promise.all([

        fetch(
          `${getApiUrl()}/api/girls/${slug}`,
          fetchConfig
        ),

        fetch(
          `${getApiUrl()}/api/cities/${slug}`,
          fetchConfig
        ),

        fetch(
          `${getApiUrl()}/api/subcities/${slug}`,
          fetchConfig
        ),

      ]);

      /* ================= GIRL ================= */

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

      if (cityRes.ok) {

        const cityData =
          await cityRes.json();

        if (
          cityData?.city?._id
        ) {

          return {

            type: "city",
            data: cityData,

          };

        }
      }

      /* ================= SUBCITY ================= */

      if (subCityRes.ok) {

        const subCityData =
          await subCityRes.json();

        if (
          subCityData?.subCity?._id
        ) {

          return {

            type: "subcity",
            data:
              subCityData.subCity,

          };

        }
      }

      return null;

    } catch (err) {

      return null;

    }
  }
);

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
  /* ================= DATA ========================== */
  /* ================================================= */

  let data = null;

  if (
    result.type === "city"
  ) {

    data =
      result.data.city;

  }

  else {

    data =
      result.data;

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
    data?.imageUrl ||
    data?.profileImage ||
    data?.image ||
    "https://girlswithwine.com/images/girlswithwine.jpg";

  /* ================================================= */
  /* ================= SEO TITLE ===================== */
  /* ================================================= */

  const seoTitle =
    data?.seo?.title ||
    data?.seoTitle ||
    data?.heading ||
    "Girls With Wine";

  /* ================================================= */
  /* ================= SEO DESCRIPTION =============== */
  /* ================================================= */

  const seoDescription =
    data?.seo?.description ||
    data?.seoDescription ||
    data?.subDescription ||
    data?.heading ||
    "Premium escort service";

  /* ================================================= */
  /* ================= OG TITLE ====================== */
  /* ================================================= */

  const ogTitle =
    data?.seo?.ogTitle ||
    data?.ogTitle ||
    seoTitle;

  /* ================================================= */
  /* ================= OG DESCRIPTION ================ */
  /* ================================================= */

  const ogDescription =
    data?.seo?.ogDescription ||
    data?.ogDescription ||
    seoDescription;

  /* ================================================= */
  /* ================= FACEBOOK TITLE ================ */
  /* ================================================= */

  const facebookTitle =
    data?.seo?.facebookTitle ||
    data?.facebookTitle ||
    ogTitle;

  /* ================================================= */
  /* ================= FACEBOOK DESCRIPTION ========== */
  /* ================================================= */

  const facebookDescription =
    data?.seo?.facebookDescription ||
    data?.facebookDescription ||
    ogDescription;

  /* ================================================= */
  /* ================= TWITTER TITLE ================ */
  /* ================================================= */

  const twitterTitle =
    data?.seo?.twitterTitle ||
    data?.twitterTitle ||
    ogTitle;

  /* ================================================= */
  /* ================= TWITTER DESCRIPTION =========== */
  /* ================================================= */

  const twitterDescription =
    data?.seo?.twitterDescription ||
    data?.twitterDescription ||
    ogDescription;

  /* ================================================= */
  /* ================= KEYWORDS ====================== */
  /* ================================================= */

  const seoKeywords =
    data?.seo?.seoKeywords ||
    data?.seoKeywords ||
    "";

  /* ================================================= */
  /* ================= CANONICAL ===================== */
  /* ================================================= */

  const canonicalUrl =
    data?.seo?.canonical ||
    data?.canonical ||
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
        ogTitle,

      description:
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

      "facebook:title":
        facebookTitle,

      "facebook:description":
        facebookDescription,

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

/* ================================================= */
/* ================= PAGE ========================== */
/* ================================================= */

export default async function Page({
  params,
}) {

  const { slug } =
    await params;

  /* ================================================= */
  /* ================= DECODE SLUG =================== */
  /* ================================================= */

  const decodedSlug =
    decodeURIComponent(
      slug || ""
    );

  /* ================================================= */
  /* ================= INVALID URL =================== */
  /* ================================================= */

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

  /* ================================================= */
  /* ================= CHECK SLUG ==================== */
  /* ================================================= */

  const result =
    await checkSlug(
      decodedSlug
    );

  /* ================================================= */
  /* ================= NOT FOUND ===================== */
  /* ================================================= */

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
  /* ================= CITY PAGE ===================== */
  /* ================================================= */

  if (
    result.type === "city"
  ) {

    const { city } =
      result.data;

    /* ================================================= */
    /* ================= FAQ SCHEMA ==================== */
    /* ================================================= */

    const faqSchema =
      await getFaqSchema(
        "city",
        city?._id
      );

    /* ================================================= */
    /* ================= LATITUDE ====================== */
    /* ================================================= */

    let latitude =
      city?.latitude;

    let longitude =
      city?.longitude;

    /* ================================================= */
    /* ================= CITY NAME ===================== */
    /* ================================================= */

    const cityNameRaw =
      city?.mainCity ||
      city?.name ||
      decodedSlug;

    const cityName =
      cityNameRaw
        ?.split(" ")
        ?.map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        ?.join(" ");

    /* ================================================= */
    /* ================= GET LAT LONG ================== */
    /* ================================================= */

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
    /* ================= PAGE URL ====================== */
    /* ================================================= */

    const pageUrl =
      `https://girlswithwine.com/${decodedSlug}`;

    /* ================================================= */
    /* ================= IMAGE URL ===================== */
    /* ================================================= */

    const imageUrl =
      city?.imageUrl ||
      city?.image ||
      "https://girlswithwine.com/images/girlswithwine.jpg";

    /* ================================================= */
    /* ================= SEO DATA ====================== */
    /* ================================================= */

    const canonicalUrl =
      city?.seo?.canonical ||
      city?.canonical ||
      pageUrl;

    const seoTitle =
      city?.seo?.title ||
      city?.seoTitle ||
      city?.heading ||
      `${cityName} Escort Service`;

    const seoDescription =
      city?.seo?.description ||
      city?.seoDescription ||
      city?.subDescription ||
      `Book verified call girls and escorts in ${cityName}.`;

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
    /* ================= FAQ JSON FIX ================== */
    /* ================================================= */

    const faqJson =
      faqSchema?.schema ||
      faqSchema ||
      null;

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

          name:
            "Home",

          item:
            "https://girlswithwine.com/",
        },

        {
          "@type":
            "ListItem",

          position: 2,

          name:
            cityName,

          item:
            canonicalUrl,
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

      name:
        seoTitle,

      url:
        canonicalUrl,

      image:
        imageUrl,

      telephone:
        "+91-XXXXXXXXXX",

      priceRange:
        "₹2999 - ₹19999",

      description:
        seoDescription,

      keywords:
        seoKeywords,

      address: {

        "@type":
          "PostalAddress",

        addressLocality:
          cityName,

        addressRegion:
          city?.state ||
          city?.stateName ||
          "",

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

      sameAs: [
        canonicalUrl,
      ],

    };

    /* ================================================= */
    /* ================= SERVICE SCHEMA ================ */
    /* ================================================= */

    const serviceSchema = {

      "@context":
        "https://schema.org",

      "@type":
        "Service",

      name:
        seoTitle,

      provider: {

        "@type":
          "Organization",

        name:
          "Girls With Wine",

        url:
          "https://girlswithwine.com/",

      },

      url:
        canonicalUrl,

      areaServed: {

        "@type":
          "City",

        name:
          cityName,

      },

      serviceType:
        serviceTypes,

      description:
        seoDescription,

      keywords:
        seoKeywords,

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

        {/* ================================================= */}
        {/* ================= FAQ SCHEMA ==================== */}
        {/* ================================================= */}

        {faqJson && (

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  faqJson
                ),
            }}
          />

        )}

        {/* ================================================= */}
        {/* ================= BREADCRUMB ==================== */}
        {/* ================================================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                breadcrumbSchema
              ),
          }}
        />

        {/* ================================================= */}
        {/* ================= LOCAL BUSINESS ================ */}
        {/* ================================================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                localBusinessSchema
              ),
          }}
        />

        {/* ================================================= */}
        {/* ================= SERVICE ======================= */}
        {/* ================================================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                serviceSchema
              ),
          }}
        />

        {/* ================================================= */}
        {/* ================= GEO META ====================== */}
        {/* ================================================= */}

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

        {/* ================================================= */}
        {/* ================= PAGE ========================== */}
        {/* ================================================= */}

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
    result.type === "subcity"
  ) {

    const faqSchema =
      await getFaqSchema(
        "subcity",
        result.data?._id
      );

    return (

      <>
        <Hash404 />

        {faqSchema?.schema && (

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  faqSchema.schema
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
    result.type === "girl"
  ) {

    const faqSchema =
      await getFaqSchema(
        "girl",
        result.data?._id
      );

    return (

      <>
        <Hash404 />

        {faqSchema?.schema && (

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  faqSchema.schema
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