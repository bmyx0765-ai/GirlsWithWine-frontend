"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp, FaUser } from "react-icons/fa";
import Link from "next/link";

const images = [
  {
    src: "/images/call-girls-India.webp",
    alt: "Call girls in India",
  },
  {
    src: "/images/call-girls-girlswithwine-banner.webp",
    alt: "Verified profiles",
  },
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
    <div className="relative w-full overflow-hidden bg-black">
      {/* IMAGE */}
      <img
        key={index}
        src={images[index].src}
        alt={images[index].alt}
        className="w-full h-full object-cover zoom-animation"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* MOBILE BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] flex sm:hidden shadow-lg">
        <a
          href={whatsappLink}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-semibold"
        >
          <FaWhatsapp className="text-lg" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="#featured-models"
          scroll={true}
          className="flex-1"
        >
          <div className="flex items-center justify-center gap-2 py-4 bg-pink-600 text-white font-semibold">
            <FaUser className="text-lg" />
            <span>Profiles</span>
          </div>
        </Link>
      </div>

      {/* DESKTOP BUTTONS */}
      <div className="hidden sm:flex absolute bottom-12 left-16 gap-4 z-50">
        <a
          href={whatsappLink}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="group flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105"
        >
          <FaWhatsapp className="text-2xl" />
          <span>Chat on WhatsApp</span>
        </a>

        <Link href="#featured-models" scroll={true}>
          <button className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black text-white font-bold rounded-full transition-all hover:scale-105">
            <FaUser className="text-xl group-hover:text-pink-600 transition-colors" />
            <span>Browse Profiles</span>
          </button>
        </Link>
      </div>
    </div>
  );
}