"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl.js";

export default function ImageSlider({
  images = [],
}) {

  const [current, setCurrent] =
    useState(0);

  const [
    isHovering,
    setIsHovering,
  ] = useState(false);

  /* =========================================
     AUTO SLIDE
  ========================================= */

  useEffect(() => {

    if (
      isHovering ||
      images.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {

        setCurrent(
          (prev) =>

            prev ===
            images.length - 1
              ? 0
              : prev + 1
        );

      }, 3000);

    return () =>
      clearInterval(
        interval
      );

  }, [
    images.length,
    isHovering,
  ]);

  /* =========================================
     NO IMAGE
  ========================================= */

  if (!images.length) {

    return (

      <div className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden border bg-gray-100 flex items-center justify-center">

        <img
          src="/placeholder.jpg"
          alt="Placeholder"
          className="w-full h-full object-cover"
        />

      </div>
    );
  }

  /* =========================================
     PREV
  ========================================= */

  const prevSlide = () => {

    setCurrent(

      current === 0
        ? images.length -
          1
        : current - 1
    );
  };

  /* =========================================
     NEXT
  ========================================= */

  const nextSlide = () => {

    setCurrent(

      current ===
        images.length - 1
        ? 0
        : current + 1
    );
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

    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-xl border bg-gray-50 group"
      onMouseEnter={() =>
        setIsHovering(
          true
        )
      }
      onMouseLeave={() =>
        setIsHovering(
          false
        )
      }
    >

      {/* =========================================
         IMAGE
      ========================================= */}

      <img
        src={getImageUrl(
          images[current]
        )}
        alt={`Profile ${
          current + 1
        }`}
        className="w-full h-full object-cover transition-all duration-500"
        loading="lazy"
        onError={(e) => {

          e.currentTarget.src =
            "/placeholder.jpg";
        }}
      />

      {/* =========================================
         LEFT BUTTON
      ========================================= */}

      {images.length >
        1 && (

        <button
          onClick={
            prevSlide
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition"
        >

          <ChevronLeft size={20} />

        </button>
      )}

      {/* =========================================
         RIGHT BUTTON
      ========================================= */}

      {images.length >
        1 && (

        <button
          onClick={
            nextSlide
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition"
        >

          <ChevronRight size={20} />

        </button>
      )}

      {/* =========================================
         DOTS
      ========================================= */}

      {images.length >
        1 && (

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

          {images.map(
            (
              _,
              i
            ) => (

              <div
                key={i}
                onClick={() =>
                  setCurrent(
                    i
                  )
                }
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
                  i ===
                  current
                    ? "bg-white scale-110"
                    : "bg-white/50"
                  }`}
              />
            )
          )}

        </div>
      )}

      {/* =========================================
         ONLINE TAG
      ========================================= */}

      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">

        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

        <span className="text-[10px] font-black uppercase text-slate-800">

          Online Now

        </span>

      </div>

    </div>
  );
}