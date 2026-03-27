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

export default function Home() {
    return (
        <>

        <ZoomSlider />
            

            {/* <CitySection /> */}

            <FeaturedModelsSection />
            {/* <ServicesSection />
            <ModelAboutSection />
            <MostSearchedLocations /> */}
            <AboutAndReviewsSection />
            <TopReviewsSlider/>
            <LatestBlogsSection />
        </>
    );
}