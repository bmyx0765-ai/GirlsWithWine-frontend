"use client";

/* ================= IMPORTS ================= */
import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FiMapPin, FiMessageCircle, FiPhoneCall } from "react-icons/fi";

import CommonFaq from "@/components/CommonFaq";
import CityMetaSection from "@/components/CityMetaSection";

import { getGirlsBySubCityThunk } from "@/store/slices/girlSlice";
import { fetchSubCitiesByCity } from "@/store/slices/subCitySlice";

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
    `Hi ${name}, I saw your profile on the website and I am interested in your services. Please let me know your availability.`
  );
  return `https://wa.me/${cleanNumber(number)}?text=${msg}`;
};

/* ================= COMPONENT ================= */

const SubCityGirlsPage = ({ data }) => {
  console.log("🟢 1. PROPS DATA RECEIVED:", data);

  const router = useRouter();
  const dispatch = useDispatch();

  /* ================= REDUX SELECTORS ================= */
  const { cityGirls = [], cityLoading = false } = useSelector((state) => {
    console.log("🔵 2. REDUX SELECTOR (girls state):", state.girls);
    return state.girls || {};
  });

  const { subCities: allSubCitiesInCity = [] } = useSelector((state) => {
    console.log("🟣 3. REDUX SELECTOR (subCity state):", state.subCity);
    return state.subCity || {};
  });

  /* ================= NO DATA GUARD ================= */
  if (!data) {
    console.warn("⚠️ 4. DATA IS NULL OR UNDEFINED");
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2 className="text-3xl font-bold text-gray-900">No Data Found</h2>
      </div>
    );
  }

  /* ================= DESTRUCTURING ================= */
  const {
    _id,
    heading,
    name,
    description,
    girls: initialGirls = [],
    city,
    tags = [],
    subCities = [],
    updatedAt,
  } = data;

  console.log("📦 5. DESTRUCTURED VARIABLES:", { _id, name, cityId: city?._id, subCitiesCount: subCities?.length });

  const finalName = name || "Premium Area";
  const cityHeading = heading || `${finalName} Call Girls`;

  /* ================= DATA FETCHING ================= */
  useEffect(() => {
    console.log("🚀 6. USE-EFFECT TRIGGERED - ID:", _id);
    if (_id) {
      // Fetch girls specific to this sub-city
      dispatch(getGirlsBySubCityThunk(_id));
    }

    if (city?._id) {
      // Fetch all sibling areas for the navigation/meta section
      dispatch(fetchSubCitiesByCity(city._id));
    }
  }, [_id, city?._id, dispatch]);

  /* ================= DATA PROCESSING ================= */
  const finalGirls = cityGirls?.length ? cityGirls : initialGirls;
  console.log("💃 7. FINAL GIRLS LIST TO RENDER:", { count: finalGirls.length, source: cityGirls?.length ? "Redux" : "InitialProps" });

  const formattedDate = useMemo(() => {
    console.log("📅 8. MEMO DATE CALCULATION - updatedAt:", updatedAt);
    if (!updatedAt) return "";
    return new Date(updatedAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [updatedAt]);

  const subCitiesList = useMemo(() => {
    // If Redux has the full list of areas for the city, use it; otherwise fallback to prop data
    const list = allSubCitiesInCity?.length ? allSubCitiesInCity : (city?.subCities?.length ? city.subCities : subCities);
    console.log("📍 9. MEMO SUBCITIES LIST CALCULATION:", {
      source: allSubCitiesInCity?.length ? "ReduxState" : "CityParent",
      listLength: list?.length || 0
    });
    return Array.isArray(list) ? list : [];
  }, [allSubCitiesInCity, city, subCities]);

  console.log("🖼️ 10. RENDERING START");

  return (
    <>
      {/* ================= MAIN CONTENT ================== */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20 mt-10">
        
        {/* HERO/HEADING SECTION */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-[#B30059] px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-sm">
            <FiMapPin className="animate-bounce" />
            {city?.mainCity?.toUpperCase() || finalName.toUpperCase()}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            {cityHeading}
          </h1>

          {formattedDate && (
            <p className="text-sm text-gray-400 mt-4 font-medium italic">
              Last Updated: {formattedDate}
            </p>
          )}
        </div>

        {/* GIRLS GRID/LIST SECTION */}
        <div className="space-y-8">
          {cityLoading ? (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl py-24 text-center">
              <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-xl font-medium tracking-wide">
                Finding the best profiles in {finalName}...
              </p>
            </div>
          ) : !finalGirls?.length ? (
            <div className="text-center py-20 border-2 border-gray-50 rounded-3xl bg-gray-50/50">
              <p className="text-gray-500 text-lg">
                No active profiles found in <span className="font-bold text-gray-700">{finalName}</span> at the moment.
              </p>
            </div>
          ) : (
            finalGirls.map((girl, index) => {
              if (index === 0) console.log("📝 11. MAPPING GIRLS - Sample Girl Name:", girl?.name);
              
              const wp = formatPhone(girl?.whatsappNumber || city?.whatsappNumber);
              const call = formatPhone(girl?.phoneNumber || city?.phoneNumber);

              return (
                <div
                  key={girl?._id || `girl-${index}`}
                  onClick={() => router.push(`/${girl?.permalink}`)}
                  className="group cursor-pointer bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-2xl hover:border-pink-200 transition-all duration-300 border flex flex-col md:flex-row gap-6 items-center md:items-stretch"
                >
                  {/* PROFILE IMAGE */}
                  <div className="w-full md:w-56 h-72 md:h-52 rounded-[1.5rem] overflow-hidden bg-gray-100 shrink-0 shadow-inner relative">
                    <img
                      src={girl?.imageUrl || girl?.imageUrls?.[0] || "/placeholder.jpg"}
                      alt={girl?.imageAlt || girl?.name || "Premium Profile"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-sm"></div>
                  </div>

                  {/* PROFILE DETAILS */}
                  <div className="flex-1 flex flex-col justify-between py-2 text-center md:text-left">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#B30059] transition-colors">
                        {girl?.heading || girl?.name}
                      </h3>
                      
                      <div
                        className="text-base text-gray-600 mt-3 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML(girl?.description || girl?.subHeading),
                        }}
                      />

                      <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm mt-5 font-bold uppercase tracking-wider text-[#B30059]">
                        {girl?.age && (
                          <span className="bg-pink-50 px-3 py-1 rounded-md">{girl.age} Years</span>
                        )}
                        <span className="text-gray-300">|</span>
                        <span className="bg-pink-50 px-3 py-1 rounded-md">Verified</span>
                        <span className="text-gray-300">|</span>
                        <span className="bg-pink-50 px-3 py-1 rounded-md">{finalName}</span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4 mt-6 justify-center md:justify-end flex-wrap w-full">
                      {wp && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={createWhatsAppURL(girl?.name, wp)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-sm rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-green-100"
                        >
                          <FiMessageCircle size={18} />
                          WhatsApp
                        </a>
                      )}
                      {call && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={`tel:${cleanNumber(call)}`}
                          className="flex items-center gap-2 px-6 py-3 bg-[#B30059] text-white text-sm rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-pink-100"
                        >
                          <FiPhoneCall size={18} />
                          Call Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SEO DESCRIPTION CARD */}
        {description && (
          <div className="mt-20 p-8 md:p-12 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 "></div>
            <div
              className="prose prose-pink max-w-none prose-p:text-gray-600 prose-p:leading-loose prose-headings:text-gray-900 prose-strong:text-[#B30059]"
              dangerouslySetInnerHTML={{
                __html: cleanHTML(description),
              }}
            />
          </div>
        )}
      </div>

      {/* ================= FAQ SECTION =================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-xl shadow-pink-50/50 border border-pink-50">
          <CommonFaq
            type="subcity"
            subCityId={_id}
            title={`Frequently Asked Questions – ${finalName}`}
            subTitle={`Everything you need to know about booking premium call girl services in ${finalName}.`}
          />
        </div>
      </div>

      {/* ================= META/LOCATION LINKS SECTION ================== */}
      {console.log("🏁 12. FINAL META SECTION PROPS:", { subCitiesCount: subCitiesList.length })}
      <CityMetaSection
        subCities={subCitiesList} 
        tags={tags || []}
      />
    </>
  );
};

export default SubCityGirlsPage;