
import { cache } from "react";
import Hash404 from "@/components/Hash404";
import SubCityGirlsPage from "@/components/SubCityGirlsPage";

export const revalidate = 300;

function getApiUrl() {

  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://girlswithwinebackend.vercel.app"
  );

}

async function getFaqSchema(subCityId) {
  try {

    if (!subCityId) {
      return {
        visibleFaqs: [],
        schema: null,
      };
    }

    const trueUrl =
      `${getApiUrl()}/api/faqs/visibility?type=subcity&visible=true&subCityId=${subCityId}`;

    const falseUrl =
      `${getApiUrl()}/api/faqs/visibility?type=subcity&visible=false&subCityId=${subCityId}`;

   const [trueRes, falseRes] = await Promise.all([
  fetch(trueUrl, {
    next: { revalidate: 300 },
  }),
  fetch(falseUrl, {
    next: { revalidate: 300 },
  }),
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

        faqList =
          faqList.filter(
            (faq) =>
              faq?.question &&
              faq?.answer
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

    return {

      visibleFaqs,

      schema: {

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

      },

    };

  } catch (error) {

    return {
      visibleFaqs: [],
      schema: null,
    };

  }
}

const checkSlug = cache(async (subCitySlug) => {
  try {
    if (!subCitySlug) return null;

    const apiUrl =
      `${getApiUrl()}/api/subcities/${subCitySlug}`;

    const subCityRes = await fetch(apiUrl, {
      next: { revalidate: 300 },
    });

    if (!subCityRes.ok) {
      return null;
    }

    const subCityData = await subCityRes.json();

    if (!subCityData?.subCity?._id) {
      return null;
    }

    return {
      type: "subcity",
      data: subCityData.subCity,
      seo: subCityData.seo,
    };
  } catch (err) {
    console.error("SUBCITY SLUG ERROR:", err);
    return null;
  }
});

export async function generateMetadata({
  params,
}) {

  const {
    citySlug,
    subCitySlug,
  } = await params;

  const subCity =
    await checkSlug(
      subCitySlug
    );

  if (!subCity) {

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

const data =
  subCity.data;

const seo =
  subCity.seo || {};

  const pageUrl =
    `https://girlswithwine.com/${citySlug}/${subCitySlug}`;

  const imageUrl =
    "https://girlswithwine.com/images/girlswithwine.jpg";

 const seoTitle =
  seo?.title ||
  data?.seoTitle ||
  data?.heading ||
  "Girls With Wine";

const seoDescription =
  seo?.description ||
  data?.seoDescription ||
  data?.subDescription ||
  data?.heading ||
  "Premium escort service";

  // const seoKeywords =
  //   data?.seo?.seoKeywords ||
  //   data?.seoKeywords ||
  //   "";

  const canonicalUrl =
    data?.seo?.canonical ||
    data?.canonical ||
    pageUrl;

  return {

    title:
      seoTitle,

    description:
      seoDescription,

    // keywords:
    //   typeof seoKeywords === "string"
    //     ? seoKeywords
    //         .split(",")
    //         .map((k) =>
    //           k.trim()
    //         )
    //     : Array.isArray(
    //         seoKeywords
    //       )
    //     ? seoKeywords
    //     : [],

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

      type:
        "website",

      images: [
        {
          url:
            imageUrl,
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


export default async function Page({
  params,
}) {

  const {
    citySlug,
    subCitySlug,
  } = await params;



  const decodedSlug =
    decodeURIComponent(
      subCitySlug || ""
    );

  if (
    decodedSlug.includes("#") ||
    decodedSlug.includes("%23") ||
    decodedSlug.includes("?") ||
    decodedSlug.includes("&")
  ) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>
          404 Not Found
        </h1>
      </div>
    );

  }

  const result =
    await checkSlug(
      decodedSlug
    );

  if (!result) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>
          404 Not Found
        </h1>
      </div>
    );

  }

  const faqSchema =
    await getFaqSchema(
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