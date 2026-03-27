"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopReviewsThunk } from "@/store/slices/reviewSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TopReviewsSlider() {
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollRef = useRef(null);

  const { topReviews } = useSelector((state) => state.review || {});

  useEffect(() => {
    dispatch(getTopReviewsThunk());
  }, [dispatch]);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#A3195B] tracking-tight">
              Client Experiences <span className="text-gray-400">💬</span>
            </h2>
            <p className="mt-2 text-gray-600">
              Discover why our clients trust us for premium services.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => scroll(-350)} className="p-3 bg-white border rounded-full shadow hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll(350)} className="p-3 bg-white border rounded-full shadow hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
        >
          {topReviews
            ?.filter((review) => review.status === "Approved")
            ?.map((review) => (
              <div
                key={review._id}
                onClick={() => {
                  if (review?.girl?.permalink) {
                    router.push(`/${review.girl.permalink}`); 
                  }
                }}
                className="min-w-[300px] md:min-w-[380px] cursor-pointer snap-start bg-white rounded-3xl p-8 shadow hover:shadow-xl transition flex flex-col"
              >
                {/* COMMENT */}
                <div className="flex flex-col grow gap-3 mb-6">
                  <Quote className="text-[#A3195B] w-8 h-8" />
                  <p className="text-sm text-gray-700 italic line-clamp-4">
                    "{review.comment}"
                  </p>
                </div>

                {/* USER */}
                <div className="flex items-center gap-4 pt-6 border-t">

                  {/* IMAGE FIX */}
                  <div className="relative w-12 h-12">
                    <Image
                      src={
                        review?.girl?.imageUrl?.startsWith("http")
                          ? review.girl.imageUrl
                          : "/placeholder-user.png"
                      }
                      alt={review?.girl?.name || "User"}
                      fill
                      unoptimized
                      className="rounded-full object-cover border"
                    />
                  </div>

                  <div className="flex flex-col grow">
                    <h4 className="font-bold text-gray-900">
                      {review.userName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Visited{" "}
                      <span className="text-[#A3195B] font-medium">
                        {review.girl?.name}
                      </span>
                    </p>
                  </div>

                  {/* RATING */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < (review.rating || 5)
                            ? "text-amber-400"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}