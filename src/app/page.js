// app/page.jsx

import ClientHome from "@/components/ClientHome";

/* ================= FAQ FETCH ================= */

async function getFaqSchema() {

  try {

    const res = await fetch(
      "http://localhost:5000/api/faqs/type/homepage",
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    console.log("FAQ DATA:", data);

    // FIXED
    const faqList = data?.[0]?.faqs || [];

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

    console.log("FAQ ERROR:", error);

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    };
  }
}

/* ================= PAGE ================= */

export default async function Home() {

  const faqSchema = await getFaqSchema();

  return (
    <>
      {/* FAQ SCHEMA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* HOME */}

      <ClientHome />
    </>
  );
}