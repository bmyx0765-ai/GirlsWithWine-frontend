"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getTopReviewsThunk,
} from "@/store/slices/reviewSlice";

import {
  useRouter,
} from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

import {
  convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl.js";

export default function TopReviewsSlider() {

  const dispatch =
    useDispatch();

  const router =
    useRouter();

  const scrollRef =
    useRef(null);

  const [imageErrors, setImageErrors] =
    useState({});

  const {
    topReviews,
  } = useSelector(
    (state) =>
      state.review || {}
  );

  useEffect(() => {

    dispatch(
      getTopReviewsThunk()
    );

  }, [dispatch]);

  /* =========================================
     SCROLL
  ========================================= */

  const scroll = (
    offset
  ) => {

    if (
      scrollRef.current
    ) {

      scrollRef.current.scrollBy(
        {
          left: offset,
          behavior:
            "smooth",
        }
      );
    }
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

      return "/placeholder-user.png";
    }

    return convertCloudinaryUrl(
      url
    );
  };

  return (

    <section className="bg-gray-50 py-16 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        {/* =========================================
           HEADER
        ========================================= */}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">

          <div className="max-w-xl">

            <h2 className="text-3xl md:text-4xl font-extrabold text-[#A3195B] tracking-tight">

              WHAT CLIENTS
              ACROSS INDIA SAY{" "}

              <span className="text-gray-400">

                💬

              </span>

            </h2>

            <p className="mt-2 text-gray-600">

              Our clients from
              major cities across
              India appreciate
              privacy, comfort and
              genuine companionship.
              Here’s what they
              share about their
              experience

            </p>

          </div>

          {/* ARROWS */}

          <div className="flex gap-3">

            <button
              onClick={() =>
                scroll(-350)
              }
              className="p-3 bg-white border rounded-full shadow hover:bg-gray-100 transition-all"
            >

              <ChevronLeft size={20} />

            </button>

            <button
              onClick={() =>
                scroll(350)
              }
              className="p-3 bg-white border rounded-full shadow hover:bg-gray-100 transition-all"
            >

              <ChevronRight size={20} />

            </button>

          </div>

        </div>

        {/* =========================================
           SLIDER
        ========================================= */}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
        >

          {topReviews

            ?.filter(
              (
                review
              ) =>
                review.status ===
                "Approved"
            )

            ?.map(
              (
                review
              ) => (

                <div
                  key={
                    review._id
                  }
                  onClick={() => {

                    if (
                      review
                        ?.girl
                        ?.permalink
                    ) {

                      router.push(
                        `/call-girls/${review.girl.permalink}`
                      );
                    }
                  }}
                  className="min-w-[300px] md:min-w-[380px] cursor-pointer snap-start bg-white rounded-3xl p-8 shadow hover:shadow-xl transition flex flex-col"
                >

                  {/* =========================================
                     COMMENT
                  ========================================= */}

                  <div className="flex flex-col grow gap-3 mb-6">

                    <Quote className="text-[#A3195B] w-8 h-8" />

                    <p className="text-sm text-gray-700 italic line-clamp-4">

                      "
                      {
                        review.comment
                      }
                      "

                    </p>

                  </div>

                  {/* =========================================
                     USER
                  ========================================= */}

                  <div className="w-12 h-12 rounded-full overflow-hidden border flex-shrink-0 bg-gray-100">

                    {imageErrors[review._id] ? (

                      <div className="w-full h-full flex items-center justify-center text-[10px] text-red-500 font-medium text-center px-1">
                        No Image
                      </div>

                    ) : (

                      <img
                        src={
                          review?.girl?.imageUrl
                            ? getImageUrl(
                              review.girl.imageUrl
                            )
                            : ""
                        }
                        alt={
                          review?.girl?.name ||
                          "User"
                        }
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => {

                          console.error(
                            "IMAGE ERROR =>",
                            review?.girl?.imageUrl
                          );

                          setImageErrors(
                            (prev) => ({

                              ...prev,

                              [review._id]:
                                true,

                            })
                          );

                        }}
                      />

                    )}

                  </div>

                </div>
              )
            )}

        </div>

      </div>

    </section>
  );
}