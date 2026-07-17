"use client";

/* ================= IMPORTS ================= */

import {
  memo,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import dynamic from "next/dynamic";


import {
  useDispatch,
  useSelector,
  shallowEqual,
} from "react-redux";

import { useInView } from "react-intersection-observer";

import {
  getGirlsByCityThunk,
} from "@/store/slices/girlSlice";

import {
  getCityPageThunk,
} from "@/store/slices/citySlice";

import GirlCard from "./GirlCard";

/* ================= DYNAMIC IMPORTS ================= */

const CommonFaq = dynamic(
  () => import("./CommonFaq"),
  {
    ssr: false,
    loading: () => (
      <div className="py-10 text-center text-gray-500">
        Loading FAQs...
      </div>
    ),
  }
);

const CityMetaSection = dynamic(
  () => import("./CityMetaSection"),
  {
    ssr: false,
    loading: () => null,
  }
);



/* ================= SKELETON ================= */

const GirlCardSkeleton = memo(() => (
  <div className="flex gap-4 rounded-2xl border bg-white p-4 shadow-sm animate-pulse">

    <div className="h-32 w-28 rounded-xl bg-gray-200 sm:h-40 sm:w-40" />

    <div className="flex-1 space-y-3">

      <div className="h-5 w-3/4 rounded bg-gray-200" />

      <div className="h-4 w-full rounded bg-gray-100" />

      <div className="h-4 w-2/3 rounded bg-gray-100" />

      <div className="mt-5 flex gap-3">
        <div className="h-9 w-24 rounded-lg bg-gray-200" />
        <div className="h-9 w-20 rounded-lg bg-gray-200" />
      </div>

    </div>

  </div>
));

GirlCardSkeleton.displayName = "GirlCardSkeleton";


export default function CityGirlsPage({ params }) {
  /* ================= PARAMS ================= */

  const { cityName } = params;

  /* ================= HOOKS ================= */

  const dispatch = useDispatch();

  /* ================= REDUX ================= */

  const {
    singleCity,
    loading: cityPageLoading,
  } = useSelector(
    (state) => ({
      singleCity: state.city.singleCity,
      loading: state.city.loading,
    }),
    shallowEqual
  );

  const {
    cityGirls,
    cityGirlsPagination,
    cityLoading,
    cityLoaded,
  } = useSelector(
    (state) => ({
      cityGirls: state.girls.cityGirls,
      cityGirlsPagination: state.girls.cityGirlsPagination,
      cityLoading: state.girls.cityLoading,
      cityLoaded: state.girls.cityLoaded,
    }),
    shallowEqual
  );

 


  const [currentPage, setCurrentPage] = useState(1);


  /* ================= FAQ ================= */

  const { ref: faqRef, inView: faqInView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  useEffect(() => {

    if (!cityName) return;

    dispatch(
      getCityPageThunk(cityName)
    );

  }, [
    dispatch,
    cityName,
  ]);

  useEffect(() => {

    if (!singleCity?._id) return;

    dispatch(

      getGirlsByCityThunk({

        cityId:
          singleCity._id,

        page:
          currentPage

      })

    );

  }, [

    dispatch,

    singleCity?._id,

    currentPage

  ]);

  /* ================= HELPERS ================= */

  const cleanHTML = (html = "") =>
    html
      .replace(/<html.*?>/gi, "")
      .replace(/<\/html>/gi, "")
      .replace(/<body.*?>/gi, "")
      .replace(/<\/body>/gi, "");



  const formatName = (slug = "") =>
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  /* ================= MEMO ================= */

  const safeGirls = useMemo(() => {
    if (Array.isArray(cityGirls)) return cityGirls;
    if (Array.isArray(cityGirls?.data)) return cityGirls.data;
    return [];
  }, [cityGirls]);

  const totalPages =
    cityGirlsPagination?.totalPages || 1;

  const cityObj =
    singleCity ?? {};

  const finalName = useMemo(
    () => cityObj.mainCity || formatName(cityName),
    [cityObj.mainCity, cityName, formatName]
  );

  const cityHeading = useMemo(
    () => cityObj.heading || `${finalName} Call Girls`,
    [cityObj.heading, finalName]
  );

  const finalDescription = useMemo(
    () =>
      cityObj.description ||
      "<p>No description available</p>",
    [cityObj.description]
  );

  const formattedDate = useMemo(() => {
    if (!cityObj.updatedAt) return "";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(cityObj.updatedAt));
  }, [cityObj.updatedAt]);

  /* ================= SCROLL ================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const pages = useMemo(
    () =>
      Array.from(
        { length: totalPages },
        (_, i) => i + 1
      ),
    [totalPages]
  );

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20">


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


        <div className="space-y-6">
          {!cityLoaded ? (

            Array.from({ length: 6 }).map((_, index) => (
              <GirlCard
                key={index}
                loading
              />
            ))

          ) : safeGirls.length > 0 ? (

            safeGirls.map((girl) => (
              <GirlCard
                key={girl._id}
                girl={girl}
                cityObj={cityObj}
                finalName={finalName}
              />
            ))

          ) : (

            <p className="text-center py-10 text-gray-400">
              No results found
            </p>

          )}
        </div>


        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-1 border rounded-lg"
            >
              Prev
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-1 rounded-lg ${currentPage === page
                  ? "bg-[#B30059] text-white"
                  : "border"
                  }`}
              >
                {page}
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


        <div className="mt-16 p-6 bg-white rounded-2xl shadow-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: cleanHTML(finalDescription),
            }}
          />
        </div>
      </div>

      <div
        ref={faqRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24"
      >
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-sm border border-gray-100">

          {faqInView ? (
            <CommonFaq
              type="city"
              cityId={singleCity?._id}
              title={`FAQs – ${finalName} Call Girls & VIP Escorts`}
              subTitle={`Find answers to the most common questions related to ${finalName} escort services, booking process, privacy, and availability.`}
            />
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-14 bg-gray-100 rounded" />
              <div className="h-14 bg-gray-100 rounded" />
              <div className="h-14 bg-gray-100 rounded" />
            </div>
          )}

        </div>
      </div>

      {faqInView && (
        <CityMetaSection
          subCities={singleCity?.subCities || []}
          tags={singleCity?.tags || []}
          cityName={finalName.toLowerCase()}

        />
      )}
    </>
  );
}