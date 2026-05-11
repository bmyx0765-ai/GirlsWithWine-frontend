"use client";

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  HelpCircle,
  ArrowLeft,
  Save,
  Globe,
  MapPin,
  Building2,
  UserCircle,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

/* =========================================================
   THUNKS
========================================================= */

import {
  addFaqThunk,
} from "@/store/slices/faqSlice";

import {
  getCitiesThunk,
} from "@/store/slices/citySlice";

import {
  fetchSubCities,
} from "@/store/slices/subCitySlice";

import {
  getAllGirlsThunk,
} from "@/store/slices/girlSlice";

/* =========================================================
   COMPONENT
========================================================= */

const AddFaq = () => {

  const dispatch = useDispatch();

  const router = useRouter();

  const { cities = [] } =
    useSelector((state) => state.city);

  const { subCities = [] } =
    useSelector((state) => state.subCity);

  const { girls = [] } =
    useSelector((state) => state.girls);

  const { loading } =
    useSelector((state) => state.faq);

  /* =========================================================
     CONFIG
  ========================================================= */

  const [config, setConfig] = useState({
    type: "homepage",
    city: "",
    subCity: "",
    girl: "",
    status: "Active",
  });

  /* =========================================================
     FAQ STATE
  ========================================================= */

  const [faqs, setFaqs] = useState([
    {
      question: "",
      answer: "",

      showOn: {
        homepage: true,
        city: false,
        subcity: false,
        girl: false,
      },
    },
  ]);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {

    dispatch(getCitiesThunk());

    dispatch(fetchSubCities());

    dispatch(getAllGirlsThunk());

  }, [dispatch]);

  /* =========================================================
     CONFIG CHANGE
  ========================================================= */

  const handleConfigChange = (e) => {

    const { name, value } = e.target;

    // RESET SHOWON
    if (name === "type") {

      const updatedFaqs = faqs.map((faq) => ({

        ...faq,

        showOn: {
          homepage: value === "homepage",
          city: value === "city",
          subcity: value === "subcity",
          girl: value === "girl",
        },
      }));

      setFaqs(updatedFaqs);
    }

    setConfig((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "type" && {
        city: "",
        subCity: "",
        girl: "",
      }),
    }));
  };

  /* =========================================================
     FAQ CHANGE
  ========================================================= */

  const handleFaqChange = (
    index,
    e
  ) => {

    const { name, value } = e.target;

    const updatedFaqs = [...faqs];

    updatedFaqs[index][name] = value;

    setFaqs(updatedFaqs);
  };

  /* =========================================================
     CHECKBOX CHANGE
  ========================================================= */

  const handleShowOnChange = (
    index,
    field
  ) => {

    const updatedFaqs = [...faqs];

    updatedFaqs[index].showOn[field] =
      !updatedFaqs[index].showOn[field];

    setFaqs(updatedFaqs);
  };

  /* =========================================================
     ADD FAQ FIELD
  ========================================================= */

  const addNewFaqField = () => {

    setFaqs([
      ...faqs,

      {
        question: "",
        answer: "",

        showOn: {
          homepage:
            config.type === "homepage",

          city:
            config.type === "city",

          subcity:
            config.type === "subcity",

          girl:
            config.type === "girl",
        },
      },
    ]);
  };

  /* =========================================================
     REMOVE FAQ FIELD
  ========================================================= */

  const removeFaqField = (index) => {

    if (faqs.length > 1) {

      setFaqs(
        faqs.filter((_, i) => i !== index)
      );
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const finalPayload = {
      type: config.type,

      status: config.status,

      city:
        config.type === "city"
          ? config.city
          : undefined,

      subCity:
        config.type === "subcity"
          ? config.subCity
          : undefined,

      girl:
        config.type === "girl"
          ? config.girl
          : undefined,

      faqs: faqs.map((item) => ({
        question: item.question,

        answer: item.answer,

        showOn: item.showOn,
      })),
    };

    try {

      await dispatch(
        addFaqThunk(finalPayload)
      ).unwrap();

      router.push("/admin/all-faq");

    } catch (err) {

      alert(
        err || "Failed to add FAQs"
      );
    }
  };

  /* =========================================================
     TYPE ICON
  ========================================================= */

  const getTypeIcon = () => {

    switch (config.type) {

      case "city":
        return (
          <MapPin className="w-5 h-5 text-pink-500" />
        );

      case "subcity":
        return (
          <Building2 className="w-5 h-5 text-blue-500" />
        );

      case "girl":
        return (
          <UserCircle className="w-5 h-5 text-purple-500" />
        );

      default:
        return (
          <Globe className="w-5 h-5 text-green-500" />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-4xl mx-auto">

        {/* =========================================================
           HEADER
        ========================================================= */}

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => router.back()}
              className="p-2 bg-white hover:bg-gray-100 rounded-xl border transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div>

              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Bulk Create FAQs
              </h1>

              <p className="text-gray-500 text-sm">
                Add multiple FAQs with custom visibility.
              </p>

            </div>
          </div>
        </div>

        {/* =========================================================
           FORM
        ========================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* =========================================================
             CONFIG SECTION
          ========================================================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">

              <HelpCircle className="w-5 h-5 text-pink-600" />

              <h3 className="text-lg font-bold text-gray-800">
                Target Configuration
              </h3>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">

              {/* TYPE */}

              <div>

                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  FAQ Placement
                </label>

                <div className="relative flex items-center">

                  <div className="absolute left-4 z-10 pointer-events-none">
                    {getTypeIcon()}
                  </div>

                  <select
                    name="type"
                    value={config.type}
                    onChange={handleConfigChange}
                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none cursor-pointer outline-none"
                  >

                    <option value="homepage">
                      Homepage
                    </option>

                    <option value="city">
                      City
                    </option>

                    <option value="subcity">
                      SubCity
                    </option>

                    <option value="girl">
                      Girl Profile
                    </option>

                  </select>

                  <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />

                </div>
              </div>

              {/* DYNAMIC DROPDOWN */}

              <AnimatePresence mode="wait">

                {config.type !== "homepage" && (

                  <motion.div
                    key={config.type}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                  >

                    {config.type === "city" && (
                      <Dropdown
                        label="Select City"
                        name="city"
                        value={config.city}
                        onChange={handleConfigChange}
                        options={cities}
                        labelKey="mainCity"
                      />
                    )}

                    {config.type === "subcity" && (
                      <Dropdown
                        label="Select SubCity"
                        name="subCity"
                        value={config.subCity}
                        onChange={handleConfigChange}
                        options={subCities}
                        labelKey="name"
                      />
                    )}

                    {config.type === "girl" && (
                      <Dropdown
                        label="Select Girl"
                        name="girl"
                        value={config.girl}
                        onChange={handleConfigChange}
                        options={girls}
                        labelKey="name"
                      />
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* =========================================================
             FAQS
          ========================================================= */}

          <div className="space-y-6">

            <div className="flex items-center justify-between px-4">

              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Questions & Answers
              </h3>

              <button
                type="button"
                onClick={addNewFaqField}
                className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" />

                Add More Question
              </button>
            </div>

            <AnimatePresence>

              {faqs.map((faq, index) => (

                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: -50,
                  }}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative group"
                >

                  {/* REMOVE */}

                  {faqs.length > 1 && (

                    <button
                      type="button"
                      onClick={() =>
                        removeFaqField(index)
                      }
                      className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}

                  <div className="grid gap-6">

                    {/* QUESTION */}

                    <div>

                      <label className="block text-[10px] font-bold text-pink-500 mb-2 uppercase tracking-widest">
                        Question {index + 1}
                      </label>

                      <input
                        type="text"
                        name="question"
                        value={faq.question}
                        onChange={(e) =>
                          handleFaqChange(index, e)
                        }
                        placeholder="Enter question"
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        required
                      />
                    </div>

                    {/* ANSWER */}

                    <div>

                      <label className="block text-[10px] font-bold text-pink-500 mb-2 uppercase tracking-widest">
                        Answer {index + 1}
                      </label>

                      <textarea
                        name="answer"
                        value={faq.answer}
                        onChange={(e) =>
                          handleFaqChange(index, e)
                        }
                        rows={4}
                        placeholder="Enter answer"
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all font-medium resize-none"
                        required
                      />
                    </div>

                    {/* =========================================================
                       SHOW ON CHECK SYSTEM
                    ========================================================= */}

                    <div>

                      <label className="block text-[10px] font-bold text-pink-500 mb-4 uppercase tracking-widest">
                        Show FAQ On
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {config.type === "homepage" && (

                          <CheckCard
                            label="Homepage"
                            checked={
                              faq.showOn.homepage
                            }
                            onChange={() =>
                              handleShowOnChange(
                                index,
                                "homepage"
                              )
                            }
                          />
                        )}

                        {config.type === "city" && (

                          <CheckCard
                            label="City"
                            checked={
                              faq.showOn.city
                            }
                            onChange={() =>
                              handleShowOnChange(
                                index,
                                "city"
                              )
                            }
                          />
                        )}

                        {config.type === "subcity" && (

                          <CheckCard
                            label="SubCity"
                            checked={
                              faq.showOn.subcity
                            }
                            onChange={() =>
                              handleShowOnChange(
                                index,
                                "subcity"
                              )
                            }
                          />
                        )}

                        {config.type === "girl" && (

                          <CheckCard
                            label="Girl"
                            checked={
                              faq.showOn.girl
                            }
                            onChange={() =>
                              handleShowOnChange(
                                index,
                                "girl"
                              )
                            }
                          />
                        )}

                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* =========================================================
             FOOTER
          ========================================================= */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm  bottom-8 z-20">

            {/* STATUS */}

            <div className="flex items-center gap-4">

              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Visibility
              </span>

              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    config.status === "Active"
                  }
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      status:
                        e.target.checked
                          ? "Active"
                          : "Inactive",
                    }))
                  }
                />

                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>

              </label>

              <span
                className={`text-xs font-bold ${
                  config.status === "Active"
                    ? "text-pink-600"
                    : "text-gray-400"
                }`}
              >
                {config.status.toUpperCase()}
              </span>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-pink-100 transition-all active:scale-95 disabled:bg-gray-400"
            >

              {loading ? (

                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

              ) : (

                <>
                  <Save className="w-5 h-5" />
                  Save All FAQs
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   DROPDOWN
========================================================= */

const Dropdown = ({
  label,
  name,
  value,
  onChange,
  options,
  labelKey,
}) => (

  <div className="relative flex flex-col">

    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
      {label}
    </label>

    <div className="relative flex items-center">

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-4 pr-10 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none cursor-pointer outline-none"
      >

        <option value="">
          -- Choose Option --
        </option>

        {options.map((opt) => (

          <option
            key={opt._id}
            value={opt._id}
          >
            {opt[labelKey]}
          </option>
        ))}
      </select>

      <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />

    </div>
  </div>
);

/* =========================================================
   CHECK CARD
========================================================= */

const CheckCard = ({
  label,
  checked,
  onChange,
}) => (

  <label
    className={`border rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between ${
      checked
        ? "border-pink-500 bg-pink-50"
        : "border-gray-200 bg-white"
    }`}
  >

    <span className="text-sm font-semibold text-gray-700">
      {label}
    </span>

    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-pink-600"
    />
  </label>
);

export default AddFaq;