"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // ✅ AUTO SLIDE
  useEffect(() => {
    if (isHovering) return; // pause on hover

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // 3 sec

    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  if (!images.length) return null;

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-xl border bg-gray-50 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >

      {/* IMAGE */}
      <Image
        src={images[current]}
        alt="profile"
        fill
        className="object-cover transition-all duration-500"
        unoptimized
      />

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={20} />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
              i === current ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* ONLINE TAG */}
      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black uppercase text-slate-800">
          Online Now
        </span>
      </div>
    </div>
  );
}