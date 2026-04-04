"use client";

import { useEffect, useState } from "react";

const images = [
  {
    src: "/images/call-girls-India.webp",
    alt: "Call girls in India - premium escort service",
  },
  {
    src: "/images/call-girls-girlswithwine-banner.webp",
    alt: "Girls With Wine escort service banner - verified profiles",
  },
];

export default function ZoomSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center">
      
      {/* IMAGE */}
      <img
        key={index}
        src={images[index].src}
        alt={images[index].alt}  // ✅ dynamic alt
        className="max-w-full max-h-full object-contain zoom-animation"
      />

      {/* CSS */}
      <style jsx>{`
        @keyframes zoomFade {
          0% {
            transform: scale(1.15);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .zoom-animation {
          animation: zoomFade 4s ease-in-out;
        }
      `}</style>
    </div>
  );
}