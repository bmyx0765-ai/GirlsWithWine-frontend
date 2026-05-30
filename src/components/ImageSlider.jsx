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
     FILTER VALID IMAGES
  ========================================= */

  const validImages =
    images.filter(
      (img) =>
        img &&
        typeof img ===
          "string" &&
        img.trim() !== ""
    );

  /* =========================================
     AUTO SLIDE
  ========================================= */

  useEffect(() => {

    if (
      isHovering ||
      validImages.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {

        setCurrent(
          (prev) =>

            prev ===
            validImages.length - 1
              ? 0
              : prev + 1
        );

      }, 3000);

    return () =>
      clearInterval(
        interval
      );

  }, [
    validImages.length,
    isHovering,
  ]);

  /* =========================================
     NO IMAGE
  ========================================= */

  if (
    !validImages.length
  ) {

    return (
      <div className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden border bg-gray-100 flex items-center justify-center">

        <span className="text-gray-400 text-sm">
          No Image
        </span>

      </div>
    );
  }

  /* =========================================
     PREV
  ========================================= */

  const prevSlide = () => {

    setCurrent(

      current === 0
        ? validImages.length -
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
        validImages.length - 1
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
      return "";
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
          validImages[current]
        )}
        alt={`Profile ${
          current + 1
        }`}
        className="w-full h-full object-cover transition-all duration-500"
        loading="lazy"
        onError={(e) => {

          // stop infinite loop
          e.currentTarget.onerror =
            null;

          e.currentTarget.style.display =
            "none";
        }}
      />

      {/* =========================================
         LEFT BUTTON
      ========================================= */}

      {validImages.length >
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

      {validImages.length >
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

      {validImages.length >
        1 && (

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

          {validImages.map(
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

    </div>
  );
}