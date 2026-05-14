"use client";

import { useEffect } from "react";

import HeroSection from "@/components/HeroSection";
import CitySection from "@/components/CitySection";
import FeaturedModelsSection from "@/components/FeaturedModelsSection";
import AboutAndReviewsSection from "@/components/AboutAndReviewsSection";
import ServicesSection from "@/components/ServicesSection";
import ModelAboutSection from "@/components/ModelAboutSection";
import MostSearchedLocations from "@/components/MostSearchedLocations";
import TopReviewsSlider from "@/components/TopReviewsSlider";
import LatestBlogsSection from "@/components/LatestBlogsSection";
import ZoomSlider from "@/components/ZoomSlider";

export default function ClientHome() {

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, []);

  return (
    <>
      {/* <ZoomSlider /> */}

      <div id="featured-models" className="scroll-mt-20">
        {/* <FeaturedModelsSection /> */}
      </div>

      {/* <CitySection /> */}
      {/* <ServicesSection /> */}
      {/* <ModelAboutSection /> */}
      {/* <MostSearchedLocations /> */}

      <AboutAndReviewsSection />

      <TopReviewsSlider />

      <LatestBlogsSection />
    </>
  );
}