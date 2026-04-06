"use client";

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
import { useEffect } from "react";

export default function Home() {
  
  useEffect(() => {
    // Force scroll to top on initial page load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Top Banner with the 'Browse Profiles' button linked to #featured-models */}
      <ZoomSlider />

      {/* Target for the ZoomSlider redirect */}
      <div id="featured-models" className="scroll-mt-20">
        <FeaturedModelsSection />
      </div>

      {/* Hidden sections can be toggled back on by uncommenting below */}
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