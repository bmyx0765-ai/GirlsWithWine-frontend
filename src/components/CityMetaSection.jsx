"use client";

import React from "react";
import Link from "next/link";

import {
  FiMapPin,
  FiHash,
  FiArrowRight,
} from "react-icons/fi";

const CityMetaSection = ({
  subCities = [],
  tags = [],
  cityName
}) => {

  /* ================= REMOVE DUPLICATES ================= */

  const uniqueSubCities = Array.from(
    new Map(
      subCities.map((item) => [item._id, item])
    ).values()
  );

  const uniqueTags = [...new Set(tags)];

  if (
    !uniqueSubCities.length &&
    !uniqueTags.length
  ) {
    return null;
  }

  return (
    <section className="w-full bg-[#f8fafc] py-12 md:py-20 border-t border-slate-200">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= TAGS ================= */}

        {uniqueTags.length > 0 && (
          <div className="mb-16 md:mb-24">

            <div className="flex flex-col items-center mb-8 md:mb-10 text-center">

              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black tracking-widest uppercase mb-4 border border-blue-100">
                <FiHash />
                Refine Search
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                Featured Keywords
              </h2>

            </div>

            <div className="flex flex-wrap justify-center gap-3">

              {uniqueTags.map((tag, index) => (

                <div
                  key={index}
                  className="
    bg-white
    text-slate-600
    text-sm
    font-extrabold
    px-6
    py-4
    rounded-2xl
    border
    border-slate-100
    shadow-sm
    hover:border-blue-500
    hover:text-blue-600
    hover:shadow-xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
                >
                  #{tag.toLowerCase()}
                </div>

              ))}

            </div>

          </div>
        )}

        {/* ================= LOCATIONS ================= */}

        {uniqueSubCities.length > 0 && (
          <div>

            <div className="flex flex-col items-center mb-8 md:mb-10 text-center">

              <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black tracking-widest uppercase mb-4 border border-indigo-100">
                <FiMapPin />
                Neighborhoods
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                Explore by Location
              </h2>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {uniqueSubCities.map((item) => (

                <Link
                  key={item?._id}

                  href={`/${cityName}/${item?.slug}`}

                  target="_blank"

                  className="
                    group
                    bg-white
                    p-6
                    rounded-[2rem]
                    border
                    border-slate-100
                    shadow-sm
                    hover:bg-indigo-600
                    hover:border-indigo-600
                    hover:shadow-2xl
                    hover:-translate-y-1
                    transition-all
                    duration-500
                    cursor-pointer
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-white/20 group-hover:text-white transition-all duration-500">
                      <FiMapPin className="text-2xl" />
                    </div>

                    <div>

                      <span className="text-slate-800 group-hover:text-white font-black text-xl block transition-colors">
                        {item?.name}
                      </span>

                      <span className="text-slate-400 group-hover:text-white/70 text-[10px] font-bold uppercase tracking-widest transition-colors">
                        View Profiles
                      </span>

                    </div>

                  </div>

                  <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-white/30 group-hover:translate-x-1 transition-all duration-500">

                    <FiArrowRight className="text-slate-300 group-hover:text-white text-base" />

                  </div>

                </Link>

              ))}

            </div>

          </div>
        )}

      </div>

    </section>
  );
};

export default CityMetaSection;