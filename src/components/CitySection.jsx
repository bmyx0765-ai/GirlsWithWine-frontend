"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

const CitySection = ({ loading, cities = [] }) => {
  const skeletonItems = new Array(12).fill(0);

  const activeCities = useMemo(() => {
    return cities
      .filter((city) => city?.status === "Active")
      .map((city) => {
        const cleanSlug = city?.slug
          ?.replace("#", "")
          ?.replace("%23", "")
          ?.replace(/^\/+|\/+$/g, "")
          ?.trim()
          ?.toLowerCase();

        if (!cleanSlug) return null;

        return {
          ...city,
          url: `/${cleanSlug}`,
        };
      })
      .filter(Boolean);
  }, [cities]);

  return (
    <section className="w-full py-16 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-black text-[#3D3948] mb-4">
            Available Across India
          </h3>
          <p className="text-[#343338] text-base sm:text-lg max-w-2xl">
            Explore trusted services in major cities across the country.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skeletonItems.map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeCities.length > 0 ? (
              activeCities.map((city) => (
                <Link
                  key={city?._id}
                  href={city.url}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-[#6A5796]/10 bg-white shadow-sm hover:shadow-lg hover:border-[#735DA5]/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 flex items-center justify-center rounded-xl w-12 h-12 bg-[#F9F9F9] text-[#735DA5] group-hover:bg-[#735DA5] group-hover:text-white transition-all duration-300">
                    <FiMapPin className="text-lg" />
                  </div>

                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-[#3D3948] group-hover:text-[#735DA5] transition-colors truncate">
                      {city?.mainCity}
                    </p>
                    <p className="text-[11px] text-[#6A5796] uppercase tracking-wider font-medium">
                      View Profiles
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-[#6A5796]">
                <p>No cities available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CitySection;