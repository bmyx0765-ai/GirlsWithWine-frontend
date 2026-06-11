"use client";
import React from "react";


export default function AboutAndReviewsSection() {
  

  const aboutSections = [
    {
      title: "Premium Companionship Services Starting at ₹2999",
      text: `Girls With Wine offers professional services with verified independent escorts suitable for private meetings, events, or travel companionship.`,
      bullets: [
        "VIP Escort Services",
        "Independent Escort Services",
        "Couple-friendly Adult Meetings",
        "Sexy Call Girl Service",
        "Hotel Escort Services",
      ],
    },
    {
      title: "Why Girls With Wine is a Trusted Choice?",
      text: `Confused about an agency to book escorts from? Girls With Wine has been serving more than a thousand clients for the past few years.`,
    },
    {
      title: "24/7 Escort Services",
      text: `Our platform lists profiles suitable for travelers, professionals, or local residents whether it is day or late at night.`,
      bullets: [
        "Browse Profiles",
        "Choose a Companion",
        "Contact Team",
        "Confirm Time & Location",
        "Make a Payment",
      ],
    },
  ];

  const features = [
    {
      icon: "🔒",
      title: "100% DISCREET & SAFE",
      desc: "100% Privacy Guaranteed — Enjoy a completely confidential experience with secure and reliable communication at every step.",
    },
    {
      icon: "⭐",
      title: "TOP-RATED ESCORTS",
      desc: "Browse verified profiles with real photos and genuine ratings for a trusted and seamless experience.",
    },
    {
      icon: "📍",
      title: "AVAILABLE ACROSS INDIA",
      desc: "Find trusted call girls and escort services near you, available across major cities in India, with easy and convenient booking 24/7.",
    },
  ];

  return (
    <section className="w-full bg-[#f8fafc] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- HERO TEXT --- */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#615186] mb-6 uppercase tracking-tight leading-tight">
            Why Choose Our Escort Service in India
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Girls With Wine offers reliable escort services across India, prioritizing privacy, comfort, and quality. Our platform connects you with independent escorts and Indian call girls for a seamless and trustworthy experience anytime.
          </p>
        </div>

        {/* --- FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((item, idx) => (
            <div key={idx} className=" group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-[#00B9BE]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#735DA5  ] mb-3 tracking-wide flex items-center justify-center">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed ">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight leading-tight">
            Girls With Wine Provide <span className="text-[#9772ED]">Escort & Call Girls</span> Services Across India
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Girls With Wine provides premium escort & Call Girls service across all cities in India. Choose from independent call girls and VIP escorts for private meetings, travel companionship, and personalized experiences available anytime
          </p>
        </div>

        {/* --- CONTENT SECTIONS --- */}
        <div className="space-y-8">
          {aboutSections.map((sec, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 transition-colors hover:border-gray-200">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 border-l-4 border-[#00B9BE] pl-4">
                {sec.title}
              </h3>

              {sec.text && (
                <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                  {sec.text}
                </p>
              )}

              {sec.bullets && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sec.bullets.map((li, index) => (
                    <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 font-medium hover:bg-[#00B9BE]/5 transition-colors">
                      <span className="flex-shrink-0 w-2 h-2 bg-[#615186] rounded-full" />
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

       

      </div>
    </section>
  );
}