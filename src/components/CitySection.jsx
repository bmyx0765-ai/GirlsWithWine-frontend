"use client";

import React from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { getSlugFromCanonical } from "@/utils/urlHelper";

const CitySection = ({ loading, cities = [] }) => {

  const skeletonItems = new Array(10).fill(0);

  return (
    <section className="w-full bg-white px-4 sm:px-8 lg:px-20 mb-10">

      <div className="max-w-7xl mx-auto">

        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-8">
          Available Cities
        </h3>

        {loading ? (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {skeletonItems.map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-full bg-gray-200 animate-pulse"
              />
            ))}
          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {cities?.length > 0 ? (

              cities.map((city) => {

                const citySlug = city?.slug || city?.mainCity;

                const stateSlug =
                  city?.state?.slug ||
                  city?.state?.name ||
                  citySlug;

const url = `/${getSlugFromCanonical(city.canonicalUrl)}`;

                console.log("City URL:", url);

                const label = `Call girls in ${city?.mainCity}`;

                return (
                  <Link
                    key={city._id}
                    href={url}
                    className="flex items-center gap-3 justify-center px-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-[#00B9BE] hover:text-white transition"
                  >

                    <div className="flex items-center justify-center rounded-full w-9 h-9 bg-[#F7EEF6] text-[#630C50]">
                      <FiSearch />
                    </div>

                    <p className="text-sm font-medium">
                      {label}
                    </p>

                  </Link>
                );

              })

            ) : (

              <p className="text-center text-gray-500 col-span-full">
                No cities found.
              </p>

            )}

          </div>

        )}

      </div>

    </section>
  );
};

export default CitySection;