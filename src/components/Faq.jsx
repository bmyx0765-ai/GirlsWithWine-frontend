"use client";

import React from "react";

const Faq = () => {
  const faqs = [
    {
      q: "How do I book an escort in India?",
      a: "You can browse profiles of Indian call girls and independent escorts, select your preferred option, and contact directly for booking. The process is simple and available across India anytime.",
    },
    {
      q: "Is escort service in India private and safe?",
      a: "Absolutely. Escort services focus on maintaining complete confidentiality while ensuring safe and private communication throughout your experience.",
    },
    {
      q: "Are the escort profiles real and verified?",
      a: "Yes, all profiles Indian call girls and escorts are verified with real photos and updated details, ensuring authenticity and helping you choose with complete confidence.",
    },
    {
      q: "Can I book escorts for travel or events in India?",
      a: "Yes, many independent escorts in India are available for travel, private events, and social occasions. You can easily mention your requirements during the booking process.",
    },
  ];

  // ===============================
  // ✅ FAQ SCHEMA (SEO)
  // ===============================
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#A3195B] mb-16">
          FAQs – Girls With Wine Escort Services
        </h2>

        {/* ================= UI ================= */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <h4 className="text-xl md:text-2xl font-bold text-[#00B9BE] mb-3">
                {faq.q}
              </h4>

              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ================= 🔥 SEO SCHEMA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
};

export default Faq;