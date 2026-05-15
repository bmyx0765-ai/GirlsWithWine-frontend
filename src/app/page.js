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

/* ================= FAQ FETCH ================= */

async function getFaqSchema() {
  try {

    /* ================= FETCH ================= */

    const res = await fetch(
      `${getApiUrl()}/api/faqs/type/homepage`,
      {
        cache: "no-store",
      }
    );

    /* ================= API FAILED ================= */

    if (!res.ok) {

      console.log("FAQ API FAILED");

      return null;
    }

    /* ================= RESPONSE ================= */

    const data = await res.json();

    console.log("FAQ DATA =>", data);

    /* ================= FAQ LIST ================= */

    let faqList = [];

    /* ================= IF API RETURNS OBJECT ================= */

    if (Array.isArray(data?.faqs)) {

      faqList = data.faqs.flatMap((group) => {

        /* ================= NESTED FAQS ================= */

        if (Array.isArray(group?.faqs)) {
          return group.faqs;
        }

        /* ================= DIRECT FAQ ================= */

        if (
          group?.question &&
          group?.answer
        ) {
          return [group];
        }

        return [];
      });

    }

    /* ================= IF API RETURNS ARRAY ================= */

    else if (Array.isArray(data)) {

      faqList = data;

    }

    console.log("FINAL FAQ LIST =>", faqList);

    /* ================= FILTER INVALID FAQS ================= */

    faqList = faqList.filter((faq) => {

      return (
        faq &&
        typeof faq === "object" &&

        typeof faq.question === "string" &&
        faq.question.trim() !== "" &&

        typeof faq.answer === "string" &&
        faq.answer.trim() !== ""
      );

    });

    console.log("FILTERED FAQS =>", faqList);

    /* ================= EMPTY ================= */

    if (!faqList.length) {

      console.log("NO FAQ FOUND");

      return null;
    }

    /* ================= FAQ SCHEMA ================= */

    const schema = {

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

    console.log(
      "FAQ SCHEMA =>",
      JSON.stringify(schema, null, 2)
    );

    return schema;

  } catch (error) {

    console.log(
      "FAQ ERROR:",
      error
    );

    return null;
  }
}

/* ================= PAGE ================= */

export default async function Home() {

  const faqSchema =
    await getFaqSchema();

  return (
    <>

      {/* ================= FAQ SCHEMA ================= */}

      {faqSchema && (

        <Script
          id="homepage-faq-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />

      )}

      {/* ================= HOME ================= */}

      <ClientHome />

    </>
  );
}