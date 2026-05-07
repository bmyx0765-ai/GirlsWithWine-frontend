import CityGirlsPage from "@/components/CityGirlsPage";
import GirlDetailsPage from "@/components/GirlDetailsPage";
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

    console.log(
      "LatLong Error:",
      err
    );

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

      if (girlData?._id) {

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

      if (cityData?.city) {

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

    console.log(
      "CHECK SLUG ERROR 👉",
      err
    );

    return null;

  }
}

/* ================================================= */
/* ================= SEO =========================== */
/* ================================================= */

export async function generateMetadata({
  params,
}) {

  const { slug } = await params;

  const result =
    await checkSlug(slug);

  if (!result) {

    return {

      title: "404 Not Found",

      description:
        "Page not found",

      robots: {
        index: false,
        follow: false,
      },

    };

  }

  if (result.type === "city") {

    const { city, seo } =
      result.data;

    return {

      title:
        seo?.title ||
        city?.heading,

      description:
        seo?.description ||
        city?.subDescription,

      keywords:
        seo?.seoKeywords
          ? seo.seoKeywords
              .split(",")
              .map((k) =>
                k.trim()
              )
          : [],

      alternates: {
        canonical:
          seo?.canonical,
      },

    };
  }

  if (result.type === "subcity") {

    const subCity =
      result.data;

    return {

      title:
        subCity?.seoTitle ||
        subCity?.heading,

      description:
        subCity?.seoDescription ||
        subCity?.subDescription,

    };
  }

  if (result.type === "girl") {

    const girl =
      result.data;

    return {

      title:
        girl?.seoTitle ||
        girl?.heading,

      description:
        girl?.seoDescription ||
        girl?.heading,

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

  const result =
    await checkSlug(slug);

  /* ================= 404 ================= */

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

  if (result.type === "city") {

    const { city } =
      result.data;

    const faqSchema =
      await getFaqSchema(
        "city",
        city?._id
      );

    let latitude =
      city?.latitude;

    let longitude =
      city?.longitude;

    const cityName =
      city?.mainCity ||
      city?.name ||
      slug;

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

    return (
      <>

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
              slug,
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