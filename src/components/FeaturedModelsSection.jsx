"use client";

import {
  getAllGirlsThunk,
} from "@/store/slices/girlSlice";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useRouter,
} from "next/navigation";

import {
  convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl.js";

export default function FeaturedModelsSection() {

  const dispatch =
    useDispatch();

  const router =
    useRouter();

  const [imageErrors, setImageErrors] =
    useState({});

  const {
    girls,
    listLoading,
  } = useSelector(
    (state) =>
      state.girls
  );

  useEffect(() => {

    dispatch(
      getAllGirlsThunk()
    );

  }, [dispatch]);

  /* =========================================
     STAR RENDER
  ========================================= */

  const renderStars = (
    rating = 0
  ) => {

    return [
      ...Array(5),
    ].map((_, i) => (

      <span key={i}>

        {i <
          rating
          ? "⭐"
          : "☆"}

      </span>
    ));
  };

  /* =========================================
     IMAGE URL
  ========================================= */

  const getImageUrl = (
    url
  ) => {

    if (
      !url ||
      typeof url !==
      "string"
    ) {

      return "/placeholder.jpg";
    }

    return convertCloudinaryUrl(
      url
    );
  };

  return (

    <section className="bg-white py-10 md:py-14">

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-6">

        {/* =========================================
           HEADING
        ========================================= */}

        <div className="mb-10 text-center">

          <h1 className="text-xl md:text-3xl font-bold text-[#A3195B] tracking-wide">

            Escort Services |
            100% Verified
            Profiles | 24/7
            Support |
            Confidential
            Booking

          </h1>

        </div>

        {/* =========================================
           LOADING
        ========================================= */}

        {listLoading ? (

          <p className="text-center text-gray-500">

            Loading...

          </p>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {girls

              ?.filter(
                (
                  model
                ) =>
                  model.showOnHomepage ===
                  true &&
                  model.status ===
                  "Active"
              )

              ?.map(
                (
                  model
                ) => (

                  <div
                    key={
                      model._id
                    }
                    onClick={() =>
                      router.push(
                        `/${model.permalink}`
                      )
                    }
                    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  >

                    {/* =========================================
                       IMAGE
                    ========================================= */}

                    {
                      imageErrors[model._id] ? (

                        <div className="w-full h-[260px] md:h-[300px] bg-gray-100 flex items-center justify-center text-gray-400">
                          No Image
                        </div>

                      ) : (

                        <img
                          src={getImageUrl(
                            model.imageUrl
                          )}
                          alt={
                            model.imageAlt ||
                            model.heading ||
                            model.name
                          }
                          className="w-full h-[260px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onLoad={() => {

                            console.log(
                              "IMAGE LOADED =>",
                              model.imageUrl
                            );

                          }}
                          onError={() => {

                            console.error(
                              "IMAGE NOT FOUND =>",
                              model.imageUrl
                            );

                            setImageErrors(
                              (prev) => ({

                                ...prev,

                                [model._id]:
                                  true,

                              })
                            );

                          }}
                        />

                      )
                    }

                    {/* =========================================
                       INFO
                    ========================================= */}

                    <div className="absolute bottom-0 left-0 right-0 bg-[#EFFAFF] px-4 py-3">

                      {/* NAME */}

                      <h3 className="text-sm md:text-base font-semibold text-black truncate">

                        {
                          model.name
                        }

                      </h3>

                      {/* =========================================
                         RATING
                      ========================================= */}

                      <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">

                        {renderStars(
                          Number(
                            model.rating
                          ) || 0
                        )}

                        <span className="text-gray-600 text-xs ml-1">

                          (
                          {
                            model.totalReviews ||
                            0
                          }
                          )

                        </span>

                      </div>

                    </div>

                  </div>
                )
              )}

          </div>
        )}

      </div>

    </section>
  );
}