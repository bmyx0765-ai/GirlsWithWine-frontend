"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp, FaUser } from "react-icons/fa";
import Link from "next/link";

const images = [
  { src: "/images/call-girls-India.webp", alt: "Call girls in India" },
  { src: "/images/call-girls-girlswithwine-banner.webp", alt: "Verified profiles" },
];

export default function ZoomSlider() {
  const [index, setIndex] = useState(0);
  const whatsappNumber = "917727937290"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-auto overflow-hidden flex items-center justify-center bg-black">

      {/* IMAGE */}
      <img
        key={index}
        src={images[index].src}
        alt={images[index].alt}
        className="w-full h-full object-cover zoom-animation"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* BUTTONS */}
      <div className="absolute bottom-6 right-4 md:bottom-12 md:left-16 md:right-auto flex flex-col sm:flex-row items-end sm:items-start gap-4">

        {/* WHATSAPP */}
        <a 
          href={whatsappLink}
          target="_blank" 
          rel="nofollow noopener noreferrer"
          className="group flex items-center justify-center gap-3 w-14 h-14 sm:w-auto sm:h-auto sm:px-8 sm:py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95"
        >
          <FaWhatsapp className="text-2xl" />
          <span className="hidden sm:inline tracking-wide">
            Chat on WhatsApp
          </span>
        </a>

        {/* BROWSE PROFILES */}
        <Link href="#featured-models" scroll={true}>
          <button className="group flex items-center justify-center gap-3 w-14 h-14 sm:w-auto sm:h-auto sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95">
            <FaUser className="text-xl group-hover:text-pink-600 transition-colors" />
            <span className="hidden sm:inline tracking-wide">
              Browse Profiles
            </span>
          </button>
        </Link>

      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes zoomFade {
          0% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .zoom-animation {
          animation: zoomFade 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}