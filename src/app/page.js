// app/page.jsx

import ClientHome from "@/components/ClientHome";
import Script from "next/script";

/* ================= API URL ================= */

function getApiUrl() {

  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://127.0.0.1:5000"
  );

}

/* =========================================================
   GET FAQ DATA
========================================================= */

async function getFaqData() {

  try {

    /* =====================================================
       TRUE FAQS
       ONLY SHOW ON FRONTEND
    ===================================================== */

    const trueRes = await fetch(

      `${getApiUrl()}/api/faqs/visibility?type=homepage&visible=true`,

      {
        cache: "no-store",
      }

    );

    /* =====================================================
       FALSE FAQS
       ONLY FOR SCHEMA
    ===================================================== */

    const falseRes = await fetch(

      `${getApiUrl()}/api/faqs/visibility?type=homepage&visible=false`,

      {
        cache: "no-store",
      }

    );

    /* =====================================================
       RESPONSE JSON
    ===================================================== */

    const trueData =
      await trueRes.json();

    const falseData =
      await falseRes.json();

    

    /* =====================================================
       EXTRACT FAQS
    ===================================================== */

    const extractFaqs = (data) => {

      let faqList = [];

      // ARRAY
      if (
        Array.isArray(data)
      ) {

        faqList = data;

      }

      // OBJECT
      else if (
        Array.isArray(data?.faqs)
      ) {

        faqList = data.faqs.flatMap(
          (group) => {

            // NESTED FAQS
            if (
              Array.isArray(group?.faqs)
            ) {

              return group.faqs;

            }

            // DIRECT FAQ
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

      /* =========================================
         REMOVE INVALID FAQ
      ========================================= */

      faqList = faqList.filter(
        (faq) => {

          return (

            faq &&

            typeof faq === "object" &&

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

    /* =====================================================
       TRUE FAQ LIST
    ===================================================== */

    const visibleFaqs =
      extractFaqs(trueData);

    /* =====================================================
       FALSE FAQ LIST
    ===================================================== */

    const hiddenFaqs =
      extractFaqs(falseData);

    /* =====================================================
       ALL FAQ FOR SCHEMA
    ===================================================== */

    const allFaqs = [

      ...visibleFaqs,

      ...hiddenFaqs,

    ];

    /* =====================================================
       FAQ SCHEMA
    ===================================================== */

    const schema = {

      "@context":
        "https://schema.org",

      "@type":
        "FAQPage",

      mainEntity:
        allFaqs.map((faq) => ({

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

        })),

    };

    return {

      visibleFaqs,
      hiddenFaqs,
      schema,

    };

  } catch (error) {

   

    return {

      visibleFaqs: [],
      hiddenFaqs: [],
      schema: null,

    };
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function Home() {

  const {
    schema,
  } = await getFaqData();

 

  return (

    <>

      {/* ===================================================
         FAQ SCHEMA
      =================================================== */}

      {schema && (

        <Script
          id="homepage-faq-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(schema),
          }}
        />

      )}

      {/* ===================================================
         HOME
      =================================================== */}

      <ClientHome
      />

    </>

  );
}