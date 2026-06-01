

// import CityGirlsPage from "@/components/CityGirlsPage";
// import Hash404 from "@/components/Hash404";




// export default async function Page({
//     params,
// }) {

//     const { citySlug } =
//         await params;

//     const decodedSlug =
//         decodeURIComponent(
//             citySlug || ""
//         );

//     /* ================= INVALID URL ================= */

//     if (
//         decodedSlug.includes("#") ||
//         decodedSlug.includes("%23") ||
//         decodedSlug.includes("?") ||
//         decodedSlug.includes("&")
//     ) {

//         return (
//             <div className="min-h-screen flex items-center justify-center bg-white">
//                 <h1 className="text-4xl md:text-6xl font-black text-slate-900">
//                     404 Not Found
//                 </h1>
//             </div>
//         );

//     }

//     /* ================= CHECK CITY ================= */

//     const result =
//         await checkSlug(
//             decodedSlug
//         );

//     /* ================= NOT FOUND ================= */

//     if (!result) {

//         return (
//             <div className="min-h-screen flex items-center justify-center bg-white">
//                 <h1 className="text-4xl md:text-6xl font-black text-slate-900">
//                     404 Not Found
//                 </h1>
//             </div>
//         );

//     }

//     const { city } =
//         result.data;

//     const faqSchema =
//         await getFaqSchema(
//             city?._id
//         );

//     let latitude =
//         city?.latitude;

//     let longitude =
//         city?.longitude;



//     const cityNameRaw =
//         city?.mainCity ||
//         city?.name ||
//         decodedSlug;

//     const cityName =
//         cityNameRaw
//             ?.split(" ")
//             ?.map(
//                 (word) =>
//                     word.charAt(0).toUpperCase() +
//                     word.slice(1).toLowerCase()
//             )
//             ?.join(" ");

//     /* ================================================= */
//     /* ================= GET LAT LONG ================== */
//     /* ================================================= */

//     if (
//         !latitude ||
//         !longitude
//     ) {

//         const geo =
//             await getLatLong(
//                 cityName
//             );

//         if (geo) {

//             latitude =
//                 geo.latitude;

//             longitude =
//                 geo.longitude;

//         }
//     }

//     /* ================================================= */
//     /* ================= PAGE URL ====================== */
//     /* ================================================= */

//     const pageUrl =
//         `https://girlswithwine.com/${decodedSlug}`;

//     /* ================================================= */
//     /* ================= IMAGE URL ===================== */
//     /* ================================================= */

//     const imageUrl =
//         "https://girlswithwine.com/images/girlswithwine.jpg";

//     /* ================================================= */
//     /* ================= SEO DATA ====================== */
//     /* ================================================= */

//     const canonicalUrl =
//         city?.seo?.canonical ||
//         city?.canonical ||
//         pageUrl;

//     const seoTitle =
//         city?.seo?.title ||
//         city?.seoTitle ||
//         city?.heading ||
//         `${cityName} Escort Service`;

//     const seoDescription =
//         city?.seo?.description ||
//         city?.seoDescription ||
//         city?.subDescription ||
//         `Book verified call girls and escorts in ${cityName}.`;

//     const seoKeywords =
//         city?.seo?.seoKeywords ||
//         city?.seoKeywords ||
//         "";

//     /* ================================================= */
//     /* ================= SERVICE TYPE ================== */
//     /* ================================================= */

//     const serviceTypes =
//         city?.serviceType ||
//         city?.seo?.serviceType ||
//         "";

//     /* ================================================= */
//     /* ================= FAQ JSON FIX ================== */
//     /* ================================================= */

//     const faqJson =
//         faqSchema?.schema ||
//         faqSchema ||
//         null;

//     /* ================================================= */
//     /* ================= BREADCRUMB ==================== */
//     /* ================================================= */

//     const breadcrumbSchema = {

//         "@context":
//             "https://schema.org",

//         "@type":
//             "BreadcrumbList",

//         itemListElement: [

//             {
//                 "@type":
//                     "ListItem",

//                 position: 1,

//                 name:
//                     "Home",

//                 item:
//                     "https://girlswithwine.com/",
//             },

//             {
//                 "@type":
//                     "ListItem",

//                 position: 2,

//                 name:
//                     cityName,

//                 item:
//                     canonicalUrl,
//             },

//         ],

//     };

//     /* ================================================= */
//     /* ================= LOCAL BUSINESS ================ */
//     /* ================================================= */

//     const localBusinessSchema = {

//         "@context":
//             "https://schema.org",

//         "@type":
//             "LocalBusiness",

//         name:
//             seoTitle,

//         url:
//             canonicalUrl,

//         image:
//             imageUrl,

//         telephone:
//             "+91-XXXXXXXXXX",

//         priceRange:
//             "₹2999 - ₹19999",

//         description:
//             seoDescription,

//         keywords:
//             seoKeywords,

//         address: {

//             "@type":
//                 "PostalAddress",

//             addressLocality:
//                 cityName,

//             addressRegion:
//                 city?.state ||
//                 city?.stateName ||
//                 "",

//             addressCountry:
//                 "IN",

//         },

//         ...(latitude &&
//             longitude && {

//             geo: {

//                 "@type":
//                     "GeoCoordinates",

//                 latitude,

//                 longitude,

//             },

//         }),

//         openingHours:
//             "Mo-Su 00:00-23:59",

//         sameAs: [
//             canonicalUrl,
//         ],

//     };

//     /* ================================================= */
//     /* ================= SERVICE SCHEMA ================ */
//     /* ================================================= */

//     const serviceSchema = {

//         "@context":
//             "https://schema.org",

//         "@type":
//             "Service",

//         name:
//             seoTitle,

//         provider: {

//             "@type":
//                 "Organization",

//             name:
//                 "Girls With Wine",

//             url:
//                 "https://girlswithwine.com/",

//         },

//         url:
//             canonicalUrl,

//         areaServed: {

//             "@type":
//                 "City",

//             name:
//                 cityName,

//         },

//         serviceType:
//             serviceTypes,

//         description:
//             seoDescription,

//         keywords:
//             seoKeywords,

//         offers: {

//             "@type":
//                 "AggregateOffer",

//             priceCurrency:
//                 "INR",

//             lowPrice:
//                 "2999",

//             highPrice:
//                 "19999",

//         },

//     };

//     return (

//         <>
//             <Hash404 />

//             {/* ================================================= */}
//             {/* ================= FAQ SCHEMA ==================== */}
//             {/* ================================================= */}

//             {faqJson && (

//                 <script
//                     type="application/ld+json"
//                     dangerouslySetInnerHTML={{
//                         __html:
//                             JSON.stringify(
//                                 faqJson
//                             ),
//                     }}
//                 />

//             )}

//             {/* ================================================= */}
//             {/* ================= BREADCRUMB ==================== */}
//             {/* ================================================= */}

//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{
//                     __html:
//                         JSON.stringify(
//                             breadcrumbSchema
//                         ),
//                 }}
//             />

//             {/* ================================================= */}
//             {/* ================= LOCAL BUSINESS ================ */}
//             {/* ================================================= */}

//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{
//                     __html:
//                         JSON.stringify(
//                             localBusinessSchema
//                         ),
//                 }}
//             />

//             {/* ================================================= */}
//             {/* ================= SERVICE ======================= */}
//             {/* ================================================= */}

//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{
//                     __html:
//                         JSON.stringify(
//                             serviceSchema
//                         ),
//                 }}
//             />

//             {/* ================================================= */}
//             {/* ================= GEO META ====================== */}
//             {/* ================================================= */}

//             {latitude &&
//                 longitude && (

//                     <>
//                         <meta
//                             name="geo.region"
//                             content="IN"
//                         />

//                         <meta
//                             name="geo.placename"
//                             content={
//                                 cityName
//                             }
//                         />

//                         <meta
//                             name="geo.position"
//                             content={`${latitude};${longitude}`}
//                         />

//                         <meta
//                             name="ICBM"
//                             content={`${latitude}, ${longitude}`}
//                         />
//                     </>

//                 )}

//             {/* ================================================= */}
//             {/* ================= PAGE ========================== */}
//             {/* ================================================= */}

//             <CityGirlsPage
//                 params={{
//                     cityName:
//                         decodedSlug,
//                 }}
//             />
//         </>

//     );

// }
    




// function getApiUrl() {

//   return (
//     process.env.NEXT_PUBLIC_API_URL ||
//     "https://girlswithwinebackend.vercel.app"
//   );

// }

// async function getLatLong(cityName) {

//     try {

//         const API_KEY =
//             process.env.OPENCAGE_API_KEY;

//         if (
//             !API_KEY ||
//             !cityName
//         ) {

//             return null;

//         }

//         const res = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${API_KEY}`,
//             {
//                 cache: "no-store",
//             }
//         );

//         if (!res.ok) {
//             return null;
//         }

//         const data =
//             await res.json();

//         if (
//             !data?.results ||
//             data.results.length === 0
//         ) {

//             return null;

//         }

//         const result =
//             data.results.find(
//                 (item) =>
//                     item?.components?.country ===
//                     "India"
//             );

//         if (!result) {
//             return null;
//         }

//         return {

//             latitude:
//                 result.geometry?.lat,

//             longitude:
//                 result.geometry?.lng,

//         };

//     } catch (err) {

//         return null;

//     }

// }


// async function getFaqSchema(cityId) {
//     try {
//         if (!cityId) {
//             return {
//                 visibleFaqs: [],
//                 schema: null,
//             };
//         }

//         const trueUrl =
//             `${getApiUrl()}/api/faqs/visibility?type=city&visible=true&cityId=${cityId}`;

//         const falseUrl =
//             `${getApiUrl()}/api/faqs/visibility?type=city&visible=false&cityId=${cityId}`;

//         const [trueRes, falseRes] =
//             await Promise.all([
//                 fetch(trueUrl, {
//                     cache: "no-store",
//                 }),
//                 fetch(falseUrl, {
//                     cache: "no-store",
//                 }),
//             ]);

//         const trueData = trueRes.ok
//             ? await trueRes.json()
//             : {};

//         const falseData = falseRes.ok
//             ? await falseRes.json()
//             : {};

//         const extractFaqs = (
//             data
//         ) => {
//             let faqList = [];

//             if (
//                 Array.isArray(data?.faqs)
//             ) {
//                 faqList =
//                     data.faqs.flatMap(
//                         (group) => {
//                             if (
//                                 Array.isArray(
//                                     group?.faqs
//                                 )
//                             ) {
//                                 return group.faqs;
//                             }

//                             if (
//                                 group?.question &&
//                                 group?.answer
//                             ) {
//                                 return [group];
//                             }

//                             return [];
//                         }
//                     );
//             }

//             faqList =
//                 faqList.filter(
//                     (faq) =>
//                         faq?.question &&
//                         faq?.answer
//                 );

//             return faqList;
//         };

//         const visibleFaqs =
//             extractFaqs(trueData);

//         const hiddenFaqs =
//             extractFaqs(falseData);

//         const allFaqs = [
//             ...visibleFaqs,
//             ...hiddenFaqs,
//         ];

//         if (!allFaqs.length) {
//             return {
//                 visibleFaqs: [],
//                 schema: null,
//             };
//         }

//         return {
//             visibleFaqs,
//             schema: {
//                 "@context":
//                     "https://schema.org",
//                 "@type":
//                     "FAQPage",
//                 mainEntity:
//                     allFaqs.map(
//                         (faq) => ({
//                             "@type":
//                                 "Question",
//                             name:
//                                 faq.question,
//                             acceptedAnswer: {
//                                 "@type":
//                                     "Answer",
//                                 text:
//                                     faq.answer,
//                             },
//                         })
//                     ),
//             },
//         };
//     } catch (error) {
//         return {
//             visibleFaqs: [],
//             schema: null,
//         };
//     }
// }

// async function checkSlug(slug) {
//     try {
//         const cityRes = await fetch(
//             `${getApiUrl()}/api/cities/${slug}`,
//             {
//                 cache: "no-store",
//             }
//         );

//         if (!cityRes.ok) {
//             return null;
//         }

//         const cityData = await cityRes.json();

//         if (!cityData?.city?._id) {
//             return null;
//         }

//         return {
//             type: "city",
//             data: cityData,
//         };

//     } catch (err) {
//         return null;
//     }
// }


// export async function generateMetadata({
//     params,
// }) {

//     const { citySlug } =
//         await params;

//     const result =
//         await checkSlug(citySlug);

//     /* ================= NOT FOUND ================= */

//     if (!result) {

//         return {

//             title:
//                 "404 Not Found",

//             description:
//                 "Page not found",

//             robots: {

//                 index: false,
//                 follow: false,

//             },

//             openGraph: {

//                 title:
//                     "404 Not Found",

//                 description:
//                     "Page not found",

//                 type:
//                     "website",

//             },

//         };

//     }

//     /* ================================================= */
//     /* ================= DATA ========================== */
//     /* ================================================= */

//     let data = null;

//     if (
//         result.type === "city"
//     ) {

//         data =
//             result.data.city;

//     }

//     else {

//         data =
//             result.data;

//     }

//     /* ================================================= */
//     /* ================= URL =========================== */
//     /* ================================================= */

//     const pageUrl =
//         `https://girlswithwine.com/${citySlug}`;

//     /* ================================================= */
//     /* ================= IMAGE ========================= */
//     /* ================================================= */

//     const imageUrl =
//         "https://girlswithwine.com/images/girlswithwine.jpg";

//     /* ================================================= */
//     /* ================= SEO TITLE ===================== */
//     /* ================================================= */

//     const seoTitle =
//         data?.seo?.title ||
//         data?.seoTitle ||
//         data?.heading ||
//         "Girls With Wine";

//     /* ================================================= */
//     /* ================= SEO DESCRIPTION =============== */
//     /* ================================================= */

//     const seoDescription =
//         data?.seo?.description ||
//         data?.seoDescription ||
//         data?.subDescription ||
//         data?.heading ||
//         "Premium escort service";

//     /* ================================================= */
//     /* ================= OG TITLE ====================== */
//     /* ================================================= */

//     const ogTitle =
//         data?.seo?.ogTitle ||
//         data?.ogTitle ||
//         seoTitle;

//     /* ================================================= */
//     /* ================= OG DESCRIPTION ================ */
//     /* ================================================= */

//     const ogDescription =
//         data?.seo?.ogDescription ||
//         data?.ogDescription ||
//         seoDescription;

//     /* ================================================= */
//     /* ================= FACEBOOK TITLE ================ */
//     /* ================================================= */

//     const facebookTitle =
//         data?.seo?.facebookTitle ||
//         data?.facebookTitle ||
//         ogTitle;

//     /* ================================================= */
//     /* ================= FACEBOOK DESCRIPTION ========== */
//     /* ================================================= */

//     const facebookDescription =
//         data?.seo?.facebookDescription ||
//         data?.facebookDescription ||
//         ogDescription;

//     /* ================================================= */
//     /* ================= TWITTER TITLE ================= */
//     /* ================================================= */

//     const twitterTitle =
//         data?.seo?.twitterTitle ||
//         data?.twitterTitle ||
//         ogTitle;

//     /* ================================================= */
//     /* ================= TWITTER DESCRIPTION =========== */
//     /* ================================================= */

//     const twitterDescription =
//         data?.seo?.twitterDescription ||
//         data?.twitterDescription ||
//         ogDescription;

//     /* ================================================= */
//     /* ================= KEYWORDS ====================== */
//     /* ================================================= */

//     // const seoKeywords =
//     //     data?.seo?.seoKeywords ||
//     //     data?.seoKeywords ||
//     //     "";

//     /* ================================================= */
//     /* ================= CANONICAL ===================== */
//     /* ================================================= */

//     const canonicalUrl =
//         data?.seo?.canonical ||
//         data?.canonical ||
//         pageUrl;

//     return {

//         /* ================= SEO ================= */

//         title:
//             seoTitle,

//         description:
//             seoDescription,

//         // keywords:
//         //   typeof seoKeywords === "string"
//         //     ? seoKeywords
//         //         .split(",")
//         //         .map((k) =>
//         //           k.trim()
//         //         )
//         //     : Array.isArray(
//         //         seoKeywords
//         //       )
//         //     ? seoKeywords
//         //     : [],

//         alternates: {

//             canonical:
//                 canonicalUrl,

//         },

//         /* ================= OPEN GRAPH ================= */

//         openGraph: {

//             title:
//                 ogTitle,

//             description:
//                 ogDescription,

//             url:
//                 canonicalUrl,

//             siteName:
//                 "Girls With Wine",

//             locale:
//                 "en_IN",

//             type:
//                 "website",

//             images: [

//                 {
//                     url:
//                         imageUrl,

//                     width: 1200,

//                     height: 630,

//                     alt:
//                         ogTitle,
//                 },

//             ],

//         },

//         /* ================= TWITTER ================= */

//         twitter: {

//             card:
//                 "summary_large_image",

//             title:
//                 twitterTitle,

//             description:
//                 twitterDescription,

//             images: [
//                 imageUrl,
//             ],

//         },

//         /* ================= EXTRA META ================= */

//         other: {

//             "og:title":
//                 ogTitle,

//             "og:description":
//                 ogDescription,

//             "facebook:title":
//                 facebookTitle,

//             "facebook:description":
//                 facebookDescription,

//             "twitter:title":
//                 twitterTitle,

//             "twitter:description":
//                 twitterDescription,

//         },

//         /* ================= ROBOTS ================= */

//         robots: {

//             index: true,
//             follow: true,

//         },

//     };

// }










import { cache } from "react";
import CityGirlsPage from "@/components/CityGirlsPage";
import Hash404 from "@/components/Hash404";

export const revalidate = 300;

function getApiUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://girlswithwinebackend.vercel.app"
  );
}

const checkSlug = cache(async (slug) => {
  try {
    if (!slug) return null;

    const cityRes = await fetch(`${getApiUrl()}/api/cities/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!cityRes.ok) return null;

    const cityData = await cityRes.json();

    if (!cityData?.city?._id) return null;

    return {
      type: "city",
      data: cityData,
    };
  } catch (err) {
    return null;
  }
});

async function getFaqSchema(cityId) {
  try {
    if (!cityId) {
      return {
        visibleFaqs: [],
        schema: null,
      };
    }

    const trueUrl = `${getApiUrl()}/api/faqs/visibility?type=city&visible=true&cityId=${cityId}`;
    const falseUrl = `${getApiUrl()}/api/faqs/visibility?type=city&visible=false&cityId=${cityId}`;

    const [trueRes, falseRes] = await Promise.all([
      fetch(trueUrl, {
        next: { revalidate: 300 },
      }),
      fetch(falseUrl, {
        next: { revalidate: 300 },
      }),
    ]);

    const trueData = trueRes.ok ? await trueRes.json() : {};
    const falseData = falseRes.ok ? await falseRes.json() : {};

    const extractFaqs = (data) => {
      let faqList = [];

      if (Array.isArray(data?.faqs)) {
        faqList = data.faqs.flatMap((group) => {
          if (Array.isArray(group?.faqs)) return group.faqs;
          if (group?.question && group?.answer) return [group];
          return [];
        });
      }

      return faqList.filter((faq) => faq?.question && faq?.answer);
    };

    const visibleFaqs = extractFaqs(trueData);
    const hiddenFaqs = extractFaqs(falseData);
    const allFaqs = [...visibleFaqs, ...hiddenFaqs];

    if (!allFaqs.length) {
      return {
        visibleFaqs: [],
        schema: null,
      };
    }

    return {
      visibleFaqs,
      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    };
  } catch (error) {
    return {
      visibleFaqs: [],
      schema: null,
    };
  }
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <h1 className="text-4xl md:text-6xl font-black text-slate-900">
        404 Not Found
      </h1>
    </div>
  );
}

function formatCityName(city, decodedSlug) {
  const cityNameRaw = city?.mainCity || city?.name || decodedSlug;

  return cityNameRaw
    ?.split(" ")
    ?.map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    ?.join(" ");
}

export default async function Page({ params }) {
  const { citySlug } = await params;

  const decodedSlug = decodeURIComponent(citySlug || "");

  if (
    decodedSlug.includes("#") ||
    decodedSlug.includes("%23") ||
    decodedSlug.includes("?") ||
    decodedSlug.includes("&")
  ) {
    return <NotFoundPage />;
  }

  const result = await checkSlug(decodedSlug);

  if (!result) {
    return <NotFoundPage />;
  }

  const { city } = result.data;

  const faqSchema = await getFaqSchema(city?._id);

  const latitude = city?.latitude;
  const longitude = city?.longitude;

  const cityName = formatCityName(city, decodedSlug);

  const pageUrl = `https://girlswithwine.com/${decodedSlug}`;
  const imageUrl = "https://girlswithwine.com/images/girlswithwine.jpg";

  const canonicalUrl = city?.seo?.canonical || city?.canonical || pageUrl;

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

  const seoKeywords = city?.seo?.seoKeywords || city?.seoKeywords || "";

  const serviceTypes = city?.serviceType || city?.seo?.serviceType || "";

  const faqJson = faqSchema?.schema || null;

  const breadcrumbSchema = {
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
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: seoTitle,
    url: canonicalUrl,
    image: imageUrl,
    telephone: "+91-XXXXXXXXXX",
    priceRange: "₹2999 - ₹19999",
    description: seoDescription,
    keywords: seoKeywords,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: city?.state || city?.stateName || "",
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
    openingHours: "Mo-Su 00:00-23:59",
    sameAs: [canonicalUrl],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seoTitle,
    provider: {
      "@type": "Organization",
      name: "Girls With Wine",
      url: "https://girlswithwine.com/",
    },
    url: canonicalUrl,
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    serviceType: serviceTypes,
    description: seoDescription,
    keywords: seoKeywords,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "2999",
      highPrice: "19999",
    },
  };

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      {latitude && longitude && (
        <>
          <meta name="geo.region" content="IN" />
          <meta name="geo.placename" content={cityName} />
          <meta name="geo.position" content={`${latitude};${longitude}`} />
          <meta name="ICBM" content={`${latitude}, ${longitude}`} />
        </>
      )}

      <CityGirlsPage
        params={{
          cityName: decodedSlug,
        }}
      />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { citySlug } = await params;

  const decodedSlug = decodeURIComponent(citySlug || "");

  const result = await checkSlug(decodedSlug);

  if (!result) {
    return {
      title: "404 Not Found",
      description: "Page not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const data = result.data.city;

  const pageUrl = `https://girlswithwine.com/${decodedSlug}`;
  const imageUrl = "https://girlswithwine.com/images/girlswithwine.jpg";

  const seoTitle =
    data?.seo?.title ||
    data?.seoTitle ||
    data?.heading ||
    "Girls With Wine";

  const seoDescription =
    data?.seo?.description ||
    data?.seoDescription ||
    data?.subDescription ||
    data?.heading ||
    "Premium escort service";

  const ogTitle = data?.seo?.ogTitle || data?.ogTitle || seoTitle;

  const ogDescription =
    data?.seo?.ogDescription || data?.ogDescription || seoDescription;

  const facebookTitle =
    data?.seo?.facebookTitle || data?.facebookTitle || ogTitle;

  const facebookDescription =
    data?.seo?.facebookDescription ||
    data?.facebookDescription ||
    ogDescription;

  const twitterTitle =
    data?.seo?.twitterTitle || data?.twitterTitle || ogTitle;

  const twitterDescription =
    data?.seo?.twitterDescription ||
    data?.twitterDescription ||
    ogDescription;

  const canonicalUrl = data?.seo?.canonical || data?.canonical || pageUrl;

  return {
    title: seoTitle,
    description: seoDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "Girls With Wine",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [imageUrl],
    },

    other: {
      "og:title": ogTitle,
      "og:description": ogDescription,
      "facebook:title": facebookTitle,
      "facebook:description": facebookDescription,
      "twitter:title": twitterTitle,
      "twitter:description": twitterDescription,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}