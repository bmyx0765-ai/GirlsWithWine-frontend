// app/page.jsx

import ClientHome from "@/components/ClientHome";

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

    const res = await fetch(
      `${getApiUrl()}/api/faqs/type/homepage`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {

      console.log(
        "FAQ API FAILED"
      );

      return {
        "@context":
          "https://schema.org",

        "@type":
          "FAQPage",

        mainEntity: [],
      };

    }

    const data =
      await res.json();

    console.log(
      "FAQ DATA =>",
      data
    );

    /* ================= FAQ LIST ================= */

    const faqList =
      data?.[0]?.faqs ||
      data?.faqs ||
      [];

    return {

      "@context":
        "https://schema.org",

      "@type":
        "FAQPage",

      mainEntity:
        faqList.map(
          (faq) => ({

            "@type":
              "Question",

            name:
              faq?.question ||
              "",

            acceptedAnswer: {

              "@type":
                "Answer",

              text:
                faq?.answer ||
                "",

            },

          })
        ),

    };

  } catch (error) {

    console.log(
      "FAQ ERROR:",
      error
    );

    return {

      "@context":
        "https://schema.org",

      "@type":
        "FAQPage",

      mainEntity: [],

    };

  }

}

/* ================= PAGE ================= */

export default async function Home() {

  const faqSchema =
    await getFaqSchema();

  return (

    <>

      {/* FAQ SCHEMA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              faqSchema
            ),
        }}
      />

      {/* HOME */}

      <ClientHome />

    </>

  );

}