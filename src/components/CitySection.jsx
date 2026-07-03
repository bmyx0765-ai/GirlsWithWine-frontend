"use client";

import React, { memo, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMapPin } from "react-icons/fi";

function CitySection({ loading = false, cities = [] }) {
  const router = useRouter();

  // Skeleton Array
  const skeletonItems = useMemo(
    () => Array.from({ length: 12 }),
    []
  );

  // Clean & Active Cities
  const activeCities = useMemo(() => {
    if (!Array.isArray(cities)) return [];

    return cities
      .filter(
        (city) =>
          city &&
          city.status === "Active" &&
          city.slug
      )
      .map((city) => {
        const cleanSlug = city.slug
          .replace(/#/g, "")
          .replace(/%23/g, "")
          .replace(/^\/+|\/+$/g, "")
          .trim()
          .toLowerCase();

        if (!cleanSlug) return null;

        return {
          ...city,
          url: `/${cleanSlug}`,
        };
      })
      .filter(Boolean);
  }, [cities]);

  // Route Prefetch
  const handlePrefetch = useCallback(
    (url) => {
      router.prefetch(url);
    },
    [router]
  );

  return (
    <section className="w-full py-16 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-[#3D3948] mb-4">
            Available Across India
          </h2>

          <p className="text-[#343338] text-base sm:text-lg max-w-2xl">
            Explore trusted services in major cities across the country.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skeletonItems.map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {activeCities.length > 0 ? (

              activeCities.map((city) => (

                <Link
                  key={city._id}
                  href={city.url}
                  prefetch={true}
                  onMouseEnter={() => handlePrefetch(city.url)}
                  aria-label={`Visit ${city.mainCity}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[#6A5796]/10 bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#735DA5]/30 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#F9F9F9] text-[#735DA5] transition-all duration-300 group-hover:bg-[#735DA5] group-hover:text-white">
                    <FiMapPin className="text-lg" />
                  </div>

                  <div className="overflow-hidden">

                    <h3 className="truncate text-sm font-bold text-[#3D3948] transition-colors group-hover:text-[#735DA5]">
                      {city.mainCity}
                    </h3>

                    <p className="text-[11px] font-medium uppercase tracking-wider text-[#6A5796]">
                      View Profiles
                    </p>

                  </div>

                </Link>

              ))

            ) : (

              <div className="col-span-full py-12 text-center">
                <p className="text-[#6A5796]">
                  No cities available at the moment.
                </p>
              </div>

            )}

          </div>
        )}
      </div>
    </section>
  );
}

export default memo(CitySection);