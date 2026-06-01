import { cache } from "react";
import GirlDetailsPage from "@/components/GirlDetailsPage";
import Hash404 from "@/components/Hash404";


export const revalidate = 300;

function getApiUrl() {

  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://girlswithwinebackend.vercel.app"
  );

}

async function getFaqSchema(girlId) {

  try {

    if (!girlId) {

      return {

        visibleFaqs: [],
        schema: null,

      };

    }

    const trueUrl =
      `${getApiUrl()}/api/faqs/visibility?type=girl&visible=true&girlId=${girlId}`;

    const falseUrl =
      `${getApiUrl()}/api/faqs/visibility?type=girl&visible=false&girlId=${girlId}`;

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

const checkSlug = cache(async (girlSlug) => {
  try {
    if (!girlSlug) return null;

    const girlRes = await fetch(
      `${getApiUrl()}/api/girls/${girlSlug}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!girlRes.ok) {
      return null;
    }

    const girlData = await girlRes.json();

    if (!girlData?._id) {
      return null;
    }

    return girlData;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}) {

  const {
    girlSlug,
  } = await params;

  const result =
    await checkSlug(
      girlSlug
    );

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

const data =
  result;
  const pageUrl =
    `https://girlswithwine.com/call-girls/${girlSlug}`;

  const imageUrl =
    "https://girlswithwine.com/images/girlswithwine.jpg";

  const seoTitle =
    data?.seo?.title ||
    data?.seoTitle ||
    data?.name ||
    data?.heading ||
    "Girls With Wine";

  const seoDescription =
    data?.seo?.description ||
    data?.seoDescription ||
    data?.description ||
    "Premium escort service";

  const ogTitle =
    data?.seo?.ogTitle ||
    data?.ogTitle ||
    seoTitle;

  const ogDescription =
    data?.seo?.ogDescription ||
    data?.ogDescription ||
    seoDescription;

  const facebookTitle =
    data?.seo?.facebookTitle ||
    data?.facebookTitle ||
    ogTitle;

  const facebookDescription =
    data?.seo?.facebookDescription ||
    data?.facebookDescription ||
    ogDescription;

  const twitterTitle =
    data?.seo?.twitterTitle ||
    data?.twitterTitle ||
    ogTitle;

  const twitterDescription =
    data?.seo?.twitterDescription ||
    data?.twitterDescription ||
    ogDescription;

//   const seoKeywords =
//     data?.seo?.seoKeywords ||
//     data?.seoKeywords ||
//     "";

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
        "profile",

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
    girlSlug,
  } = await params;


  const decodedSlug =
    decodeURIComponent(
      girlSlug || ""
    );

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

  const result =
    await checkSlug(
      decodedSlug
    );

  if (!result) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900">
          404 Not Found
        </h1>
      </div>
    );

  }

const girl =
  result;


const faqPromise =
  getFaqSchema(girl?._id);

  const faqSchema =
  await faqPromise;

  const faqJson =
    faqSchema?.schema ||
    null;

  return (

    <>
      <Hash404 />

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

      <GirlDetailsPage
        data={girl}
      />

    </>

  );

}