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
  useParams,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ArrowLeft,
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
  updateFaqThunk,
  getFaqsThunk,
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

const EditFaq = () => {

  const dispatch = useDispatch();

  const router = useRouter();

  const params = useParams();

  const id = params?.id;

  const { faqs, loading } =
    useSelector((state) => state.faq);

  const { cities = [] } =
    useSelector((state) => state.city);

  const { subCities = [] } =
    useSelector((state) => state.subCity);

  const { girls = [] } =
    useSelector((state) => state.girls);

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
     FAQ LIST
  ========================================================= */

  const [faqList, setFaqList] =
    useState([
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

  const [isDataLoaded, setIsDataLoaded] =
    useState(false);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {

    if (faqs.length === 0) {
      dispatch(getFaqsThunk());
    }

    dispatch(getCitiesThunk());

    dispatch(fetchSubCities());

    dispatch(getAllGirlsThunk());

  }, [dispatch, faqs.length]);

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {

    if (faqs.length > 0 && id) {

      const currentGroup =
        faqs.find((f) => f._id === id);

      if (currentGroup) {

        setConfig({
          type:
            currentGroup.type ||
            "homepage",

          city:
            currentGroup.city?._id ||
            currentGroup.city ||
            "",

          subCity:
            currentGroup.subCity?._id ||
            currentGroup.subCity ||
            "",

          girl:
            currentGroup.girl?._id ||
            currentGroup.girl ||
            "",

          status:
            currentGroup.status ||
            "Active",
        });

        setFaqList(

          currentGroup.faqs.map(
            (faq) => ({

              ...faq,

              showOn:
                faq.showOn || {

                  homepage:
                    currentGroup.type ===
                    "homepage",

                  city:
                    currentGroup.type ===
                    "city",

                  subcity:
                    currentGroup.type ===
                    "subcity",

                  girl:
                    currentGroup.type ===
                    "girl",
                },
            })
          )
        );

        setIsDataLoaded(true);
      }
    }

  }, [faqs, id]);

  /* =========================================================
     CONFIG CHANGE
  ========================================================= */

  const handleConfigChange = (e) => {

    const { name, value } = e.target;

    // RESET CHECK SYSTEM
    if (name === "type") {

      const updatedFaqs =
        faqList.map((faq) => ({

          ...faq,

          showOn: {
            homepage:
              value === "homepage",

            city:
              value === "city",

            subcity:
              value === "subcity",

            girl:
              value === "girl",
          },
        }));

      setFaqList(updatedFaqs);
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

    const updated = [...faqList];

    updated[index] = {
      ...updated[index],

      [name]: value,
    };

    setFaqList(updated);
  };

  /* =========================================================
     CHECK CHANGE
  ========================================================= */

  /* =========================================================
     CHECK CHANGE
  ========================================================= */

  const handleShowOnChange = (
    index,
    field
  ) => {

    setFaqList((prev) =>

      prev.map((faq, i) => {

        // ONLY UPDATE SELECTED FAQ
        if (i !== index) {
          return faq;
        }

        return {

          ...faq,

          // KEEP OLD ID SAFE
          _id: faq._id,

          showOn: {

            ...faq.showOn,

            [field]:
              !faq.showOn?.[field],
          },
        };
      })
    );
  };

  /* =========================================================
     ADD FIELD
  ========================================================= */

  const addNewField = () => {

    setFaqList([
      ...faqList,

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
     REMOVE FIELD
  ========================================================= */

  const removeField = (index) => {

    if (faqList.length > 1) {

      setFaqList(
        faqList.filter(
          (_, i) => i !== index
        )
      );
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const updateData = {

      type: config.type,

      status: config.status,

      city:
        config.type === "city"
          ? config.city
          : null,

      subCity:
        config.type === "subcity"
          ? config.subCity
          : null,

      girl:
        config.type === "girl"
          ? config.girl
          : null,

      faqs: faqList.map(
        ({
          question,
          answer,
          showOn,
        }) => ({

          question,

          answer,

          showOn,
        })
      ),
    };

    try {

      await dispatch(
        updateFaqThunk({
          id,
          data: updateData,
        })
      ).unwrap();

      router.push(
        "/admin/all-faq"
      );

    } catch (err) {

      alert(
        err ||
        "Failed to update FAQ"
      );
    }
  };

  /* =========================================================
     ICON
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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading && !isDataLoaded) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div>

            <h1 className="text-3xl font-extrabold text-gray-900">
              Edit FAQ Group
            </h1>

            <p className="text-gray-500 text-sm">
              Update FAQ details.
            </p>

          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* =========================================================
             CONFIG
          ========================================================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

            <div className="grid md:grid-cols-2 gap-8">

              {/* TYPE */}

              <div>

                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  Placement Type
                </label>

                <div className="relative flex items-center">

                  <div className="absolute left-4 z-10">
                    {getTypeIcon()}
                  </div>

                  <select
                    name="type"
                    value={config.type}
                    onChange={
                      handleConfigChange
                    }
                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none outline-none"
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
                      Girl
                    </option>

                  </select>

                  <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />

                </div>
              </div>

              {/* DYNAMIC */}

              <AnimatePresence mode="wait">

                {config.type !==
                  "homepage" && (

                    <motion.div
                      key={config.type}
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -10,
                      }}
                    >

                      {config.type ===
                        "city" && (

                          <Dropdown
                            label="Select City"
                            name="city"
                            value={
                              config.city
                            }
                            onChange={
                              handleConfigChange
                            }
                            options={cities}
                            labelKey="mainCity"
                          />
                        )}

                      {config.type ===
                        "subcity" && (

                          <Dropdown
                            label="Select SubCity"
                            name="subCity"
                            value={
                              config.subCity
                            }
                            onChange={
                              handleConfigChange
                            }
                            options={
                              subCities
                            }
                            labelKey="name"
                          />
                        )}

                      {config.type ===
                        "girl" && (

                          <Dropdown
                            label="Select Girl"
                            name="girl"
                            value={
                              config.girl
                            }
                            onChange={
                              handleConfigChange
                            }
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

            <div className="flex justify-between items-center px-4">

              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Questions & Answers
              </h3>

              <button
                type="button"
                onClick={addNewField}
                className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <AnimatePresence>

              {faqList.map(
                (faq, index) => (
                  <motion.div
                    key={faq._id || index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative"
                  >

                    {/* REMOVE */}

                    {faqList.length >
                      1 && (

                        <button
                          type="button"
                          onClick={() =>
                            removeField(
                              index
                            )
                          }
                          className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}

                    <div className="space-y-6">

                      {/* QUESTION */}

                      <input
                        type="text"
                        name="question"
                        value={
                          faq.question
                        }
                        onChange={(e) =>
                          handleFaqChange(
                            index,
                            e
                          )
                        }
                        placeholder="Question"
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 rounded-2xl outline-none"
                        required
                      />

                      {/* ANSWER */}

                      <textarea
                        name="answer"
                        value={
                          faq.answer
                        }
                        onChange={(e) =>
                          handleFaqChange(
                            index,
                            e
                          )
                        }
                        rows={4}
                        placeholder="Answer"
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 rounded-2xl outline-none resize-none"
                        required
                      />

                      {/* =========================================================
                         SHOW ON
                      ========================================================= */}

                      <div>

                        <label className="block text-[10px] font-bold text-pink-500 mb-4 uppercase tracking-widest">
                          Show FAQ On
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {config.type ===
                            "homepage" && (

                              <CheckCard
                                label="Homepage"
                                checked={
                                  faq
                                    .showOn
                                    .homepage
                                }
                                onChange={() =>
                                  handleShowOnChange(
                                    index,
                                    "homepage"
                                  )
                                }
                              />
                            )}

                          {config.type ===
                            "city" && (

                              <CheckCard
                                label="City"
                                checked={
                                  faq
                                    .showOn
                                    .city
                                }
                                onChange={() =>
                                  handleShowOnChange(
                                    index,
                                    "city"
                                  )
                                }
                              />
                            )}

                          {config.type ===
                            "subcity" && (

                              <CheckCard
                                label="SubCity"
                                checked={
                                  faq
                                    .showOn
                                    .subcity
                                }
                                onChange={() =>
                                  handleShowOnChange(
                                    index,
                                    "subcity"
                                  )
                                }
                              />
                            )}

                          {config.type ===
                            "girl" && (

                              <CheckCard
                                label="Girl"
                                checked={
                                  faq
                                    .showOn
                                    .girl
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
                )
              )}
            </AnimatePresence>
          </div>

          {/* =========================================================
             SAVE
          ========================================================= */}

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between  bottom-8 z-20">

            <label className="flex items-center gap-3 cursor-pointer">

              <div
                className={`w-12 h-6 rounded-full transition-all relative ${config.status ===
                    "Active"
                    ? "bg-pink-600"
                    : "bg-gray-200"
                  }`}
              >

                <input
                  type="checkbox"
                  className="hidden"
                  checked={
                    config.status ===
                    "Active"
                  }
                  onChange={(e) =>
                    setConfig(
                      (p) => ({
                        ...p,

                        status:
                          e.target
                            .checked
                            ? "Active"
                            : "Inactive",
                      })
                    )
                  }
                />

                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.status ===
                      "Active"
                      ? "left-7"
                      : "left-1"
                    }`}
                />
              </div>

              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {config.status}
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transition-all active:scale-95 disabled:bg-gray-300"
            >

              {loading
                ? "Updating..."
                : "Update FAQ"}
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
        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 rounded-2xl outline-none"
      >

        <option value="">
          -- Choose Option --
        </option>

        {options.map((o) => (

          <option
            key={o._id}
            value={o._id}
          >
            {o[labelKey]}
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
    className={`border rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between ${checked
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

export default EditFaq;