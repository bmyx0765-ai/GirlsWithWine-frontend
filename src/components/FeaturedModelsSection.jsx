"use client";

import { getAllGirlsThunk } from "@/store/slices/girlSlice";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function FeaturedModelsSection() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { girls, listLoading } = useSelector((state) => state.girls);

  useEffect(() => {
    dispatch(getAllGirlsThunk());
  }, [dispatch]);

  // ⭐ STAR RENDER FUNCTION
  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <span key={i}>
        {i < rating ? "⭐" : "☆"}
      </span>
    ));
  };

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-6">

        {/* HEADING */}
        <div className="mb-10 text-center">
          <h1 className="text-xl md:text-3xl font-bold text-[#A3195B] tracking-wide">
            Escort Services | 100% Verified Profiles | 24/7 Support | Confidential Booking
          </h1>
        </div>

        {/* LOADING */}
        {listLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {girls
              ?.filter(
                (model) =>
                  model.showOnHomepage === true &&
                  model.status === "Active"
              )
              ?.map((model) => (
                <div
                  key={model._id}
                  onClick={() =>
                    router.push(`/${model.permalink}`)
                  }
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* IMAGE */}
                  <Image
                    src={model.imageUrl}
                    alt={model.imageAlt || model.heading}
                    width={300}
                    height={350}
                    unoptimized
                    className="w-full h-[260px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  {/* INFO */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#EFFAFF] px-4 py-3">

                    {/* NAME */}
                    <h3 className="text-sm md:text-base font-semibold text-black">
                      {model.name}
                    </h3>



                    {/* ⭐ RATING */}
                    <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
                      {renderStars(model.rating || 0)}
                      <span className="text-gray-600 text-xs ml-1">
                        ({model.totalReviews || 0})
                      </span>
                    </div>

                  </div>
                </div>
              ))}

          </div>
        )}
      </div>
    </section>
  );
}