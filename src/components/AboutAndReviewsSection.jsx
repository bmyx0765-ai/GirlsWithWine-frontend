"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CitySection from "@/components/CitySection";
import Faq from "@/components/Faq";
import GirlsPrice from "@/components/GirlsPrice";

import { getCitiesThunk } from "@/store/slices/citySlice";

export default function AboutAndReviewsSection() {

  const dispatch = useDispatch();

  // ===============================
  // FETCH CITIES
  // ===============================
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  const { loading, cities } = useSelector((state) => state.city);


  // ===============================
  // DEBUG API RESPONSE
  // ===============================
  useEffect(() => {

    if (cities?.length) {

      console.log("Cities API Response:", cities);

      cities.forEach((city) => {

        console.log("City Name:", city?.mainCity);
        console.log("State Name:", city?.state?.name);
        console.log("State Slug:", city?.state?.slug);

      });

    }

  }, [cities]);


  // ===============================
  // ABOUT CONTENT
  // ===============================
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


  return (
    <section className="w-full font-sans bg-white">

      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-16 text-center">

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#00B9BE] mb-10 uppercase tracking-wider pb-3 border-b-4 border-gray-300 inline-block px-4">
          About Girls With Wine
        </h2>


        {/* ABOUT CONTENT */}
        <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 text-left leading-relaxed">

          {aboutSections.map((sec, i) => (

            <div key={i} className="mb-12">

              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#00B9BE] mb-4 leading-tight">
                {sec.title}
              </h3>

              {sec.text && (
                <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4">
                  {sec.text}
                </p>
              )}

              {sec.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm sm:text-base md:text-lg">
                  {sec.bullets.map((li, index) => (
                    <li key={index}>{li}</li>
                  ))}
                </ul>
              )}

            </div>

          ))}

        </div>

      </div>


      {/* PRICE SECTION */}
      <GirlsPrice />

      {/* FAQ */}
      <Faq />


      {/* CITY SECTION */}
      <CitySection
        loading={loading}
        cities={cities || []}
      />

    </section>
  );
}