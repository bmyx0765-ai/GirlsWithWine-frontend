
import CityGirlsPage from "@/components/CityGirlsPage";
import GirlDetailsPage from "@/components/GirlDetailsPage";

/* ===============================
   LAT LONG FUNCTION
================================ */
async function getLatLong(cityName) {
  try {
    const API_KEY = process.env.OPENCAGE_API_KEY;

    if (!API_KEY || !cityName) {
      console.log("❌ Missing API Key or City Name");
      return null;
    }

    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${API_KEY}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.log("❌ API Error:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) return null;

    const result = data.results.find(
      (item) =>
        item.components.country === "India" &&
        item.components._type === "city"
    );

    if (!result) return null;

    return {
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
    };
  } catch (err) {
    console.log("LatLong Error:", err);
    return null;
  }
}

/* ===============================
   API BASE URL
================================ */
function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

/* ===============================
   FETCH DATA
================================ */
async function checkSlug(slug) {
  try {
    const girlRes = await fetch(`${getApiUrl()}/api/girls/${slug}`, {
      cache: "no-store",
    });

    if (girlRes.ok) {
      const girlData = await girlRes.json();
      if (girlData?._id) {
        return { type: "girl", data: girlData };
      }
    }

    const cityRes = await fetch(`${getApiUrl()}/api/cities/${slug}`, {
      cache: "no-store",
    });

    if (cityRes.ok) {
      const cityData = await cityRes.json();
      if (cityData?.city) {
        return { type: "city", data: cityData };
      }
    }

    return null;
  } catch (err) {
    console.log("Slug Error:", err);
    return null;
  }
}

/* ===============================
   SEO METADATA
================================ */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const result = await checkSlug(slug);

  if (!result) {
    return {
      title: "Page Not Found",
      description: "This page does not exist",
      robots: { index: false, follow: false },
    };
  }

  if (result.type === "city") {
    const { city, seo } = result.data;

    return {
      title: seo?.title || city?.heading,
      description: seo?.description || city?.subDescription,
      keywords: seo?.seoKeywords
        ? seo.seoKeywords.split(",").map((k) => k.trim())
        : [],
      alternates: {
        canonical: seo?.canonical,
      },
    };
  }

 if (result.type === "girl") {
  const girl = result.data;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://girlswithwine.com";

  const slug = girl?.permalink || "";

  return {
    title: girl?.seoTitle || girl?.heading,
    description: girl?.seoDescription || girl?.heading,

    // ✅ SAFE KEYWORDS (NO CRASH)
    keywords:
      Array.isArray(girl?.seoKeywords) && girl.seoKeywords.length > 0
        ? girl.seoKeywords
        : typeof girl?.seoKeywords === "string"
        ? girl.seoKeywords.split(",").map((k) => k.trim())
        : [
            girl?.name,
            girl?.city?.[0]?.mainCity,
            "escort service",
            "call girls",
          ].filter(Boolean),

    // ✅ FIXED CANONICAL (IMPORTANT)
    alternates: {
      canonical:
        girl?.canonicalLink || `${baseUrl}/${slug}`,
    },

    // ✅ EXTRA SEO BOOST
    openGraph: {
      title: girl?.seoTitle || girl?.heading,
      description: girl?.seoDescription || girl?.heading,
      url: girl?.canonicalLink || `${baseUrl}/${slug}`,
      type: "website",
    },
  };
}
}

/* ===============================
   PAGE
================================ */
export default async function Page({ params }) {
  const { slug } = await params;

  const result = await checkSlug(slug);

  if (!result) {
    return <h1 className="text-center py-20">404 Not Found</h1>;
  }

  /* ===============================
     CITY PAGE
  ============================== */
  if (result.type === "city") {
    const { city } = result.data;

    let latitude = city?.latitude;
    let longitude = city?.longitude;

    // 🔥 SAFE CITY NAME
    const cityName = city?.mainCity || city?.name || slug;

    // 🔥 FETCH IF MISSING
    if (!latitude || !longitude) {
      const geo = await getLatLong(cityName);

      if (geo) {
        latitude = geo.latitude;
        longitude = geo.longitude;
      }
    }

    console.log("✅ FINAL GEO:", latitude, longitude);

    return (
      <>
        {/* ✅ SAFE GEO META TAGS */}
        {latitude && longitude && (
          <>
            <meta name="geo.region" content="IN" />
            <meta name="geo.placename" content={cityName} />
            <meta name="geo.position" content={`${latitude};${longitude}`} />
            <meta name="ICBM" content={`${latitude}, ${longitude}`} />
          </>
        )}

        {/* SCHEMA */}
        {result.data?.schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(result.data.schema),
            }}
          />
        )}

        <CityGirlsPage params={{ cityName: slug }} />
      </>
    );
  }

  /* ===============================
     GIRL PAGE
  ============================== */
  if (result.type === "girl") {
    return <GirlDetailsPage data={result.data} />;
  }
}
