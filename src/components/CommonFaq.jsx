"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import {
  getFaqsByTypeThunk,
  getFaqsByCityThunk,
  getFaqsBySubCityThunk,
  getFaqsByGirlThunk,
} from "@/store/slices/faqSlice";

const CommonFaq = ({ type = "homepage", cityId = null, subCityId = null, girlId = null, title = "", className = "" }) => {
  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(null);

  const { faqs = [], loading = false, error = null } = useSelector((state) => state?.faq || {});

  useEffect(() => {
    if (type === "homepage") dispatch(getFaqsByTypeThunk("homepage"));
    else if (type === "city" && cityId) dispatch(getFaqsByCityThunk(cityId));
    else if (type === "subcity" && subCityId) dispatch(getFaqsBySubCityThunk(subCityId));
    else if (type === "girl" && girlId) dispatch(getFaqsByGirlThunk(girlId));
  }, [dispatch, type, cityId, subCityId, girlId]);

  const faqList = useMemo(() => {
    if (!faqs) return [];
    if (Array.isArray(faqs) && faqs.length > 0 && faqs[0]?.showOn) {
      return faqs.filter((faq) => faq?.showOn?.[type] === true);
    }
    if (Array.isArray(faqs)) {
      return faqs.flatMap((item) => item?.faqs || []).filter((faq) => faq?.showOn?.[type] === true);
    }
    return [];
  }, [faqs, type]);

  if (loading) return <div className="py-16 text-center text-[#735DA5]">Loading...</div>;
  if (error || !faqList?.length) return null;

  return (
    <section className={`w-full py-16 bg-[#F9F9F9] ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {title && (
          <h2 className="text-4xl md:text-5xl font-black text-[#3D3948] mb-12 text-center">
            {title}
          </h2>
        )}

        <div className="space-y-6">
          {faqList.map((faq, index) => (
            <div
              key={faq?._id || index}
              className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 ${
                openIndex === index ? "border-[#735DA5] shadow-lg" : "border-[#6A5796]/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-8 text-left"
              >
                <h3 className={`text-xl font-bold transition-colors ${openIndex === index ? "text-[#735DA5]" : "text-[#3D3948]"}`}>
                  {faq?.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  className={`flex-shrink-0 ml-4 p-1 rounded-full ${openIndex === index ? "bg-[#735DA5] text-white" : "bg-[#F9F9F9] text-[#4F4567]"}`}
                >
                  <Plus size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-8 pb-8 text-[#343338] text-lg leading-relaxed border-t border-[#6A5796]/5 pt-4">
                      {faq?.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommonFaq;