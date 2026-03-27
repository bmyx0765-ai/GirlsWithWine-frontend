"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { getCitiesThunk } from "@/store/slices/citySlice";

export default function MostSearchedLocations() {

  const dispatch = useDispatch();
  const router = useRouter();

  const { cities, loading } = useSelector((state) => state.city);

  const [locations, setLocations] = useState([]);
  const [index, setIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  const sliderRef = useRef(null);

  const cardGap = 20;

  /* =================================
     RESPONSIVE CARDS COUNT
  ================================= */

  useEffect(() => {

    const updateCards = () => {

      if (window.innerWidth < 640) {
        setCardsToShow(1);
      }
      else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      }
      else {
        setCardsToShow(3);
      }

    };

    updateCards();
    window.addEventListener("resize", updateCards);

    return () => window.removeEventListener("resize", updateCards);

  }, []);

  /* =================================
     FETCH CITIES
  ================================= */

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  /* =================================
     GROUP BY STATE
  ================================= */

  useEffect(() => {

    if (!Array.isArray(cities)) return;

    const grouped = {};

    cities.forEach((city) => {

      const stateId = city.state?._id;
      const stateName = city.state?.name;
      const stateSlug = city.state?.slug || city.state?.name?.toLowerCase();

      if (!stateId || !city.mainCity) return;

      if (!grouped[stateId]) {
        grouped[stateId] = {
          stateId,
          stateName,
          stateSlug,
          cities: [],
        };
      }

      grouped[stateId].cities.push({
        cityId: city._id,
        cityName: city.mainCity.trim(),
        citySlug: city.slug || city.mainCity.toLowerCase(),
        stateSlug,
      });

    });

    setLocations(Object.values(grouped));

  }, [cities]);

  /* =================================
     SLIDER
  ================================= */

  const nextSlide = () =>
    setIndex((prev) =>
      Math.min(prev + 1, locations.length - cardsToShow)
    );

  const prevSlide = () =>
    setIndex((prev) => Math.max(prev - 1, 0));

  /* =================================
     CARD WIDTH CALC
  ================================= */

  const cardWidth = typeof window !== "undefined"
    ? (window.innerWidth < 640 ? window.innerWidth - 40 :
       window.innerWidth < 1024 ? 350 : 320)
    : 320;

  return (

    <section className="bg-[#E9F7FE] py-12 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#A3195B]">
          Most Searched Locations in India
        </h2>

        {!loading && locations.length > 0 && (

          <div className="relative flex items-center mt-10">

            {/* LEFT BUTTON */}
            <button
              onClick={prevSlide}
              disabled={index === 0}
              className="hidden md:flex text-3xl text-[#A3195B] p-3"
            >
              <FiArrowLeft />
            </button>

            <div className="overflow-hidden flex-1">

              <div
                ref={sliderRef}
                className="flex gap-5 transition-transform duration-300"
                style={{
                  transform: `translateX(-${index * (cardWidth + cardGap)}px)`
                }}
              >

                {locations.map((item) => (

                  <div
                    key={item.stateId}
                    className="bg-white rounded-2xl shadow-lg border flex flex-col py-5 h-[420px] shrink-0"
                    style={{ width: cardWidth }}
                  >

                    <div className="flex justify-center mb-3">
                      <div className="bg-[#A3195B] text-white p-3 rounded-xl">
                        <IoLocationSharp size={28} />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-center text-[#A3195B] capitalize">
                      {item.stateName}
                    </h3>

                    <ul className="mt-4 flex-1 border-t pt-2 overflow-y-auto">

                      {item.cities.slice(0, 4).map((city) => (

                        <li
                          key={city.cityId}
                          onClick={() =>
                            router.push(`/call-girls/${city.stateSlug}/${city.citySlug}`)
                          }
                          className="cursor-pointer px-5 py-2.5 border-b flex justify-between items-center hover:bg-gray-100"
                        >
                          {city.cityName} Call Girls <FiChevronRight />
                        </li>

                      ))}

                    </ul>

                  </div>

                ))}

              </div>

            </div>

            {/* RIGHT BUTTON */}
            <button
              onClick={nextSlide}
              className="hidden md:flex text-3xl text-[#A3195B] p-3"
            >
              <FiArrowRight />
            </button>

          </div>

        )}

      </div>

    </section>

  );

}