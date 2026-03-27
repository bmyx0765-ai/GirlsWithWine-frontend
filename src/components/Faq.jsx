"use client";

import React from "react";

const Faq = () => {
  const faqs = [
    {
      q: "How Do I Book Escort Services Quickly?",
      a: "Clients can contact our support team directly to book a service instantly.",
    },
    {
      q: "Are My Details Confidential?",
      a: "Absolutely. Girls With Wine never exposes a client’s information publicly. It is always kept private.",
    },
    {
      q: "Are the Escort Profiles 100% Verified?",
      a: "Yes, all companions are listed after a verification process. Their photos and details are authentic.",
    },
    {
      q: "Can I Make a Payment in Cash?",
      a: "We offer flexible booking and payment options for clients that are safe to make.",
    },
    {
      q: "Can Tourists Book an Escort Service with Girls With Wine Platform?",
      a: "Yes, bookings are available late at night, early mornings, evenings, or any day.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#A3195B] mb-16">
          FAQs – Girls With Wine Escort Services
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <h4 className="text-2xl font-bold text-[#00B9BE] mb-4">
                {faq.q}
              </h4>

              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq; 