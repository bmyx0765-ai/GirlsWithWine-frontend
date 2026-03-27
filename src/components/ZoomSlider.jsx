"use client";

import { useEffect, useState } from "react";

const images = [
  "/images/call-girls-India.webp",
  "/images/call-girls-girlswithwine-banner.webp",
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
    <div className="relative w-full h-[400px] overflow-hidden">
      
      {/* Image */}
      <img
        key={index}
        src={images[index]}
        alt="slider"
        className="w-full h-full object-cover zoom-animation"
      />

      {/* Internal CSS */}
      <style jsx>{`
        @keyframes zoomFade {
          0% {
            transform: scale(1.2);
            opacity: 0.7;
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