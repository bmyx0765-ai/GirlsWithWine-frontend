"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import FeaturedModelsSection from "@/components/FeaturedModelsSection";
import AboutAndReviewsSection from "@/components/AboutAndReviewsSection";
import TopReviewsSlider from "@/components/TopReviewsSlider";
import LatestBlogsSection from "@/components/LatestBlogsSection";
import ZoomSlider from "@/components/ZoomSlider";
import GirlsPrice from "@/components/GirlsPrice";
import CitySection from "@/components/CitySection";
import CommonFaq from "@/components/CommonFaq";

import { getCitiesThunk } from "@/store/slices/citySlice";

export default function ClientHome() {
  const dispatch = useDispatch();

  const { loading, cities } = useSelector(
    (state) => state.city
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    dispatch(getCitiesThunk());
  }, [dispatch]);

  return (
    <>
      <ZoomSlider />

      <div
        id="featured-models"
        className="scroll-mt-20"
      >
        <FeaturedModelsSection />
      </div>

      <AboutAndReviewsSection />

      <GirlsPrice />

      <TopReviewsSlider />

      <CommonFaq
        type="homepage"
        title="FAQs – Girls With Wine Escort Services"
      />

      <CitySection
        loading={loading}
        cities={cities || []}
      />

      <LatestBlogsSection />
    </>
  );
}