"use client";

import React from "react";

import Link from "next/link";

import { FiMapPin } from "react-icons/fi";

const CitySection = ({
  loading,
  cities = [],
}) => {

  /* =========================================
     SKELETON
  ========================================= */

  const skeletonItems =
    new Array(12).fill(0);

  /* =========================================
     ACTIVE CITIES
  ========================================= */

  const activeCities =
    cities.filter(
      (city) =>
        city?.status ===
        "Active"
    );

  return (

    <section className="w-full bg-transparent">

      <div className="max-w-7xl mx-auto">

        {/* =========================================
           HEADER
        ========================================= */}

        <div className="mb-10">

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-4">

            Escort Service Available Across All Cities in India

          </h3>

          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-3xl">

            Girls With Wine provides trusted escort services across major cities in India.

          </p>

        </div>

        {/* =========================================
           LOADING
        ========================================= */}

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {skeletonItems.map(
              (_, i) => (

                <div
                  key={i}
                  className="h-14 rounded-2xl bg-gray-100 animate-pulse border border-gray-50"
                />

              )
            )}

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {activeCities?.length >
            0 ? (

              activeCities.map(
                (city) => {

                  /* =========================================
                     SLUG
                  ========================================= */

                  const cleanSlug =
                    city?.slug
                      ?.replace(
                        "#",
                        ""
                      )
                      ?.replace(
                        "%23",
                        ""
                      )
                      ?.trim()
                      ?.toLowerCase();

                  /* =========================================
                     INVALID SLUG
                  ========================================= */

                  if (
                    !cleanSlug
                  ) {

                    return null;
                  }

                  /* =========================================
                     URL
                  ========================================= */

                  const url =
                    `/${cleanSlug}`;

                  return (

                    <Link
                      key={
                        city?._id
                      }
                      href={url}
                      scroll={true}
                      replace={false}
                      prefetch={false}
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-[#00B9BE]/30 transition-all duration-300 active:scale-[0.98]"
                    >

                      {/* =========================================
                         ICON
                      ========================================= */}

                      <div className="flex-shrink-0 flex items-center justify-center rounded-xl w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-[#00B9BE] group-hover:text-white transition-colors duration-300">

                        <FiMapPin className="text-lg" />

                      </div>

                      {/* =========================================
                         TEXT
                      ========================================= */}

                      <div className="overflow-hidden">

                        <p className="text-sm font-bold text-gray-700 group-hover:text-[#00B9BE] transition-colors truncate">

                          {
                            city?.mainCity
                          }

                        </p>

                        <p className="text-[11px] text-gray-400 uppercase tracking-wider group-hover:text-gray-500 transition-colors">

                          View Profiles

                        </p>

                      </div>

                    </Link>

                  );
                }
              )

            ) : (

              <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">

                <p className="text-gray-400 font-medium italic">

                  No cities found at the moment.

                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </section>

  );

};

export default CitySection;