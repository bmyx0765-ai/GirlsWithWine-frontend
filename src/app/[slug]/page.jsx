

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

    const data = await res.json();

    const faqList = data?.[0]?.faqs || [];

    if (!faqList?.length) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",

      mainEntity: faqList.map((faq) => ({
        "@type": "Question",

        name: faq?.question || "",

        acceptedAnswer: {
          "@type": "Answer",
          text: faq?.answer || "",
        },
      })),
    };

  } catch (error) {

  
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

      openGraph: {

        title:
          seoTitle,

        description:
          seoDescription,

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
              seoTitle,
          },
        ],
      },

      twitter: {

        card:
          "summary_large_image",

        title:
          seoTitle,

        description:
          seoDescription,

        images: [
          imageUrl,
        ],
      },

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

    return {

      title:
        subCity?.seoTitle ||
        subCity?.heading,

      description:
        subCity?.seoDescription ||
        subCity?.subDescription,

      alternates: {

        canonical:
          subCity?.canonical ||
          pageUrl,
      },

      openGraph: {

        title:
          subCity?.seoTitle ||
          subCity?.heading,

        description:
          subCity?.seoDescription ||
          subCity?.subDescription,

        url:
          subCity?.canonical ||
          pageUrl,

        siteName:
          "Girls With Wine",

        locale:
          "en_IN",

        type:
          "website",
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

    return {

      title:
        girl?.seoTitle ||
        girl?.heading,

      description:
        girl?.seoDescription ||
        girl?.heading,

      alternates: {

        canonical:
          girl?.canonical ||
          pageUrl,
      },

      openGraph: {

        title:
          girl?.seoTitle ||
          girl?.heading,

        description:
          girl?.seoDescription ||
          girl?.heading,

        url:
          girl?.canonical ||
          pageUrl,

        siteName:
          "Girls With Wine",

        locale:
          "en_IN",

        type:
          "website",
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
