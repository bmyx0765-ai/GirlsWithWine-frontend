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
/* ================= CHECK SLUG ==================== */
/* ================================================= */

async function checkSlug(slug) {

  try {

    /* ================================================= */
    /* ================= GIRL ========================== */
    /* ================================================= */

    const girlRes = await fetch(
      `${getApiUrl()}/api/girls/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (girlRes.ok) {

      const girlData =
        await girlRes.json();

      console.log(
        "GIRL RESPONSE 👉",
        girlData
      );

      if (girlData?._id) {

        return {
          type: "girl",
          data: girlData,
        };

      }
    }

    /* ================================================= */
    /* ================= CITY ========================== */
    /* ================================================= */

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

    /* ================================================= */
    /* ================= SUBCITY ======================= */
    /* ================================================= */

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

  /* ================================================= */
  /* ================= CITY SEO ====================== */
  /* ================================================= */

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

      openGraph: {

        title:
          seo?.title ||
          city?.heading,

        description:
          seo?.description ||
          city?.subDescription,

        url:
          seo?.canonical,

        type: "website",

      },

    };
  }

  /* ================================================= */
  /* ================= SUBCITY SEO =================== */
  /* ================================================= */

  if (result.type === "subcity") {

    const subCity =
      result.data;

    const baseUrl =
      process.env
        .NEXT_PUBLIC_BASE_URL ||
      "https://girlswithwine.com";

    return {

      title:
        subCity?.seoTitle ||
        subCity?.heading ||
        subCity?.name,

      description:
        subCity?.seoDescription ||
        subCity?.subDescription ||
        subCity?.name,

      keywords:
        Array.isArray(
          subCity?.tags
        )
          ? subCity.tags
          : [],

      alternates: {

        canonical:
          `${baseUrl}/${subCity?.slug}`,

      },

      openGraph: {

        title:
          subCity?.seoTitle ||
          subCity?.heading,

        description:
          subCity?.seoDescription ||
          subCity?.subDescription,

        url:
          `${baseUrl}/${subCity?.slug}`,

        type: "website",

      },

    };
  }

  /* ================================================= */
  /* ================= GIRL SEO ====================== */
  /* ================================================= */

  if (result.type === "girl") {

    const girl =
      result.data;

    const baseUrl =
      process.env
        .NEXT_PUBLIC_BASE_URL ||
      "https://girlswithwine.com";

    return {

      title:
        girl?.seoTitle ||
        girl?.heading,

      description:
        girl?.seoDescription ||
        girl?.heading,

      keywords:
        Array.isArray(
          girl?.seoKeywords
        )
          ? girl.seoKeywords
          : typeof girl?.seoKeywords ===
            "string"
          ? girl.seoKeywords
              .split(",")
              .map((k) =>
                k.trim()
              )
          : [],

      alternates: {

        canonical:
          girl?.canonicalLink ||
          `${baseUrl}/${girl?.permalink}`,

      },

      openGraph: {

        title:
          girl?.seoTitle ||
          girl?.heading,

        description:
          girl?.seoDescription ||
          girl?.heading,

        url:
          girl?.canonicalLink ||
          `${baseUrl}/${girl?.permalink}`,

        type: "website",

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

  const result =
    await checkSlug(slug);

  /* ================================================= */
  /* ================= 404 =========================== */
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

  if (result.type === "city") {

    const { city } =
      result.data;

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

        {/* GEO TAGS */}

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

        {/* SCHEMA */}

        {result.data
          ?.schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  result
                    .data
                    .schema
                ),
            }}
          />
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

    return (
      <SubCityGirlsPage
        data={
          result.data
        }
      />
    );

  }

  /* ================================================= */
  /* ================= GIRL PAGE ===================== */
  /* ================================================= */

  if (
    result.type ===
    "girl"
  ) {

    return (
      <GirlDetailsPage
        data={
          result.data
        }
      />
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