"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getFaqsThunk,
  getFaqsByTypeThunk,
  getFaqsByCityThunk,
  getFaqsBySubCityThunk,
  getFaqsByGirlThunk,
} from "@/store/slices/faqSlice";

const CommonFaq = ({
  type = "homepage",
  cityId = null,
  subCityId = null,
  girlId = null,
  title = "",
  className = "",
}) => {

  const dispatch = useDispatch();

  const {
    faqs = [],
    loading = false,
    error = null,
  } = useSelector((state) => state?.faq || {});

  /* ================= FETCH FAQS ================= */

  useEffect(() => {

    if (type === "homepage") {

      dispatch(getFaqsByTypeThunk("homepage"));

    } else if (type === "city" && cityId) {

      dispatch(getFaqsByCityThunk(cityId));

    } else if (type === "subcity" && subCityId) {

      dispatch(getFaqsBySubCityThunk(subCityId));

    } else if (type === "girl" && girlId) {

      dispatch(getFaqsByGirlThunk(girlId));

    } else {

      dispatch(getFaqsThunk());

    }

  }, [dispatch, type, cityId, subCityId, girlId]);

  /* ================= FAQ FILTER ================= */

  const faqList = useMemo(() => {

    if (!faqs) return [];

    // CASE 1: API directly returns faq array
    // Example:
    // { success: true, faqs: [ {showOn:{}}, {showOn:{}} ] }

    if (
      Array.isArray(faqs) &&
      faqs.length > 0 &&
      faqs[0]?.showOn
    ) {

      return faqs.filter((faq) => {
        return faq?.showOn?.[type] === true;
      });

    }

    // CASE 2: API returns grouped structure
    // Example:
    // [{ faqs:[...] }, { faqs:[...] }]

    if (Array.isArray(faqs)) {

      const allFaqs = faqs.flatMap(
        (item) => item?.faqs || []
      );

      return allFaqs.filter((faq) => {
        return faq?.showOn?.[type] === true;
      });

    }

    return [];

  }, [faqs, type]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <p className="text-lg text-gray-500 font-medium">
          Loading FAQs...
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-red-500 text-lg font-medium">
          {error}
        </p>
      </div>
    );
  }

  /* ================= HIDE SECTION ================= */

  if (!faqList?.length) {
    return null;
  }

  return (
    <section className={`w-full py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {title && (
          <div className="mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">
              {title}
            </h2>
          </div>
        )}

        <div className="space-y-8">

          {faqList.map((faq, index) => (
            <div
              key={faq?._id || index}
              className="
                bg-white
                rounded-[28px]
                shadow-md
                border
                border-gray-100
                p-6
                sm:p-8
                transition-all
                duration-300
                hover:shadow-2xl
                hover:-translate-y-1
              "
            >

              <h3
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-[#00B9BE]
                  mb-5
                  leading-snug
                "
              >
                {faq?.question}
              </h3>

              <p
                className="
                  text-gray-600
                  text-base
                  sm:text-lg
                  leading-[34px]
                  whitespace-pre-line
                "
              >
                {faq?.answer}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default CommonFaq;