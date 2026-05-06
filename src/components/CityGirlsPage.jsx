"use client";

/* ================= IMPORTS ================= */
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getGirlsByCityThunk } from "@/store/slices/girlSlice";
import { getCityPageThunk, getCitiesThunk } from "@/store/slices/citySlice";
import CitySection from "@/components/CitySection";
import CommonFaq from "./CommonFaq";
import CityMetaSection from "./CityMetaSection";

/* ================= SKELETON ================= */
const GirlCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border animate-pulse flex gap-4">
    <div className="w-28 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-xl" />
    <div className="flex-1 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-2/3" />
    </div>
  </div>
);

export default function CityGirlsPage({ params }) {
  const { cityName } = params;
  const dispatch = useDispatch();
  const router = useRouter();

  const { singleCity, cities } = useSelector((state) => state.city);
  const { cityGirls } = useSelector((state) => state.girls);

  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  /* ================= FETCH CITY PAGE ================= */
  useEffect(() => {
    if (!cityName) return;
    setPageLoading(true);
    dispatch(getCityPageThunk(cityName));
  }, [cityName, dispatch]);

  /* ================= FETCH GIRLS ================= */
  useEffect(() => {
    if (!singleCity?._id) return;

    dispatch(getGirlsByCityThunk(singleCity._id))
      .unwrap()
      .finally(() => setPageLoading(false));
  }, [singleCity?._id, dispatch]);

  /* ================= FETCH ALL CITIES (FIX REFRESH) ================= */
  useEffect(() => {
    if (!cities || cities.length === 0) {
      dispatch(getCitiesThunk());
    }
  }, [cities, dispatch]);

  /* ================= HELPERS ================= */

  const cleanHTML = (html = "") =>
    html
      .replace(/<html.*?>/gi, "")
      .replace(/<\/html>/gi, "")
      .replace(/<body.*?>/gi, "")
      .replace(/<\/body>/gi, "");

  const cleanNumber = (num) => num?.replace(/\D/g, "");

  const formatPhone = (num) => {
    if (!num) return "";
    const cleaned = cleanNumber(num);
    return cleaned.startsWith("91") ? `+${cleaned}` : `+91${cleaned}`;
  };

  const createWhatsAppURL = (name, number) => {
    const msg = encodeURIComponent(
      `Hi ${name}, I saw your profile and want to connect.`
    );
    return `https://wa.me/${cleanNumber(number)}?text=${msg}`;
  };

  const safeGirls = useMemo(() => {
    if (Array.isArray(cityGirls)) return cityGirls;
    if (Array.isArray(cityGirls?.data)) return cityGirls.data;
    return [];
  }, [cityGirls]);

  const totalPages = Math.ceil(safeGirls.length / ITEMS_PER_PAGE);

  const paginatedGirls = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return safeGirls.slice(start, start + ITEMS_PER_PAGE);
  }, [safeGirls, currentPage]);

  const formatName = (slug = "") =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* ================= CITY DATA ================= */
  const cityObj = singleCity || {};
  const finalName = cityObj?.mainCity || formatName(cityName);

  const cityHeading = cityObj?.heading || `${finalName} Call Girls`;

  const finalDescription =
    cityObj?.description || `<p>No description available</p>`;

  const formattedDate = useMemo(() => {
    if (!cityObj?.updatedAt) return "";
    return new Date(cityObj.updatedAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [cityObj?.updatedAt]);

    useEffect(() => {
    // Force scroll to top on initial page load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20">

        {/* ================= HEADING ================= */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold">
            {cityHeading}
          </h1>
          {formattedDate && (
            <p className="text-xs text-gray-400 mt-2">
              Last Updated: {formattedDate}
            </p>
          )}
        </div>

        {/* ================= LIST ================= */}
        <div className="space-y-6">
          {pageLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <GirlCardSkeleton key={i} />
            ))
          ) : paginatedGirls.length ? (
            paginatedGirls.map((girl) => {
              const wp = formatPhone(
                girl?.whatsappNumber || cityObj?.whatsappNumber
              );

              const call = formatPhone(
                girl?.phoneNumber || cityObj?.phoneNumber
              );

              return (
                <div
                  key={girl._id}
                  onClick={() =>
                    router.push(`/${girl.permalink}`)
                  }
                  className="cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition border flex flex-col sm:flex-row gap-4"
                >
                  {/* IMAGE */}
                  <div className="w-full sm:w-40 h-52 sm:h-40 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={girl.imageUrl || "/placeholder.jpg"}
                      alt={girl.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">

                    {/* TEXT */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {girl.heading}
                      </h3>

                      <div
                        className="text-sm text-gray-600 mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML(girl.description),
                        }}
                      />

                      <div className="flex flex-wrap gap-3 text-[15px] mt-3 font-semibold text-[#B30059]">
                        {girl.age && <span>{girl.age} Years</span>}
                        <span>|</span>
                        <span>Call Girls</span>
                        <span>|</span>
                        <span>{finalName}</span>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 mt-4 justify-end flex-wrap">
                      {wp && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={createWhatsAppURL(girl.name, wp)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#25D366] text-white text-sm rounded-lg font-medium hover:opacity-90 whitespace-nowrap"
                        >
                          WhatsApp
                        </a>
                      )}

                      {call && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={`tel:${cleanNumber(call)}`}
                          className="px-4 py-2 bg-[#B30059] text-white text-sm rounded-lg font-medium hover:opacity-90 whitespace-nowrap"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                // <></>
              );
            })
          ) : (
            <p className="text-center text-gray-400 py-10">
              No results found
            </p>
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-1 border rounded-lg"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-1 rounded-lg ${currentPage === i + 1
                    ? "bg-[#B30059] text-white"
                    : "border"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-1 border rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {/* ================= DESCRIPTION ================= */}
        <div className="mt-16 p-6 bg-white rounded-2xl shadow-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: cleanHTML(finalDescription),
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">

        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-sm border border-gray-100">

          <CommonFaq
            type="city"
            cityId={singleCity?._id}
            title={`FAQs – ${finalName} Call Girls & VIP Escorts`}
            subTitle={`Find answers to the most common questions related to ${finalName} escort services, booking process, privacy, and availability.`}
          />

        </div>

      </div>

      <CityMetaSection
  subCities={singleCity?.subCities || []}
  tags={singleCity?.tags || []}
/>
    </>
  );
}