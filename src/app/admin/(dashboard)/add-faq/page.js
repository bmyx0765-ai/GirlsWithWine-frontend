"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ArrowLeft, Save, Globe, MapPin, Building2, UserCircle, ChevronDown, Plus, Trash2 } from "lucide-react";

// Thunks
import { addFaqThunk } from "@/store/slices/faqSlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import { fetchSubCities } from "@/store/slices/subCitySlice";
import { getAllGirlsThunk } from "@/store/slices/girlSlice";

const AddFaq = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cities = [] } = useSelector((state) => state.city);
  const { subCities = [] } = useSelector((state) => state.subCity);
  const { girls = [] } = useSelector((state) => state.girls);
  const { loading } = useSelector((state) => state.faq);

  /* ================= STATE ================= */
  const [config, setConfig] = useState({
    type: "homepage",
    city: "",
    subCity: "",
    girl: "",
    status: "Active",
  });

  // Array of Q&A objects
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  useEffect(() => {
    dispatch(getCitiesThunk());
    dispatch(fetchSubCities());
    dispatch(getAllGirlsThunk());
  }, [dispatch]);

  /* ================= HANDLERS ================= */
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { city: "", subCity: "", girl: "" }),
    }));
  };

  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const newFaqs = [...faqs];
    newFaqs[index][name] = value;
    setFaqs(newFaqs);
  };

  const addNewFaqField = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaqField = (index) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // FIX: Frontend payload ko ek single object banana hai jisme array ho
  const finalPayload = {
    type: config.type,
    status: config.status,
    city: config.type === "city" ? config.city : undefined,
    subCity: config.type === "subcity" ? config.subCity : undefined,
    girl: config.type === "girl" ? config.girl : undefined,
    faqs: faqs.map(item => ({
      question: item.question,
      answer: item.answer
    }))
  };

  try {
    // Ab hum loop nahi chala rahe, ek hi bar mein pura object bhej rahe hain
    await dispatch(addFaqThunk(finalPayload)).unwrap();
    router.push("/admin/all-faq");
  } catch (err) {
    alert(err || "Failed to add FAQs");
  }
};

  const getTypeIcon = () => {
    switch (config.type) {
      case "city": return <MapPin className="w-5 h-5 text-pink-500" />;
      case "subcity": return <Building2 className="w-5 h-5 text-blue-500" />;
      case "girl": return <UserCircle className="w-5 h-5 text-purple-500" />;
      default: return <Globe className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 bg-white hover:bg-gray-100 rounded-xl border transition-all shadow-sm">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bulk Create FAQs</h1>
              <p className="text-gray-500 text-sm">Add multiple questions and answers at once.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* CONFIGURATION SECTION */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-bold text-gray-800">Target Configuration</h3>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">FAQ Placement</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 z-10 pointer-events-none">{getTypeIcon()}</div>
                  <select
                    name="type"
                    value={config.type}
                    onChange={handleConfigChange}
                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none cursor-pointer outline-none"
                  >
                    <option value="homepage">Homepage (General)</option>
                    <option value="city">Specific City</option>
                    <option value="subcity">Specific Sub-City</option>
                    <option value="girl">Specific Model Profile</option>
                  </select>
                  <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {config.type !== "homepage" && (
                  <motion.div key={config.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {config.type === "city" && <Dropdown label="Select Target City" name="city" value={config.city} onChange={handleConfigChange} options={cities} labelKey="mainCity" />}
                    {config.type === "subcity" && <Dropdown label="Select Target Sub-City" name="subCity" value={config.subCity} onChange={handleConfigChange} options={subCities} labelKey="name" />}
                    {config.type === "girl" && <Dropdown label="Select Target Profile" name="girl" value={config.girl} onChange={handleConfigChange} options={girls} labelKey="name" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DYNAMIC Q&A SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Questions & Answers</h3>
              <button type="button" onClick={addNewFaqField} className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline">
                <Plus className="w-4 h-4" /> Add More Question
              </button>
            </div>

            <AnimatePresence>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative group"
                >
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaqField(index)}
                      className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}

                  <div className="grid gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-pink-500 mb-2 uppercase tracking-widest">Question {index + 1}</label>
                      <input
                        type="text"
                        name="question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Ex: What are your working hours?"
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-pink-500 mb-2 uppercase tracking-widest">Answer {index + 1}</label>
                      <textarea
                        name="answer"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, e)}
                        rows={3}
                        placeholder="Enter the detailed response..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all font-medium resize-none"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* FINAL ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky bottom-8 z-20">
            <div className="flex items-center gap-4">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visibility</span>
               <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={config.status === "Active"}
                  onChange={(e) => setConfig(p => ({ ...p, status: e.target.checked ? "Active" : "Inactive" }))}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className={`text-xs font-bold ${config.status === 'Active' ? 'text-pink-600' : 'text-gray-400'}`}>
                {config.status.toUpperCase()}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-pink-100 transition-all active:scale-95 disabled:bg-gray-400"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save All FAQs</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dropdown = ({ label, name, value, onChange, options, labelKey }) => (
  <div className="relative flex flex-col">
    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}</label>
    <div className="relative flex items-center">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-4 pr-10 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none cursor-pointer outline-none"
      >
        <option value="">-- Choose Option --</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>{opt[labelKey]}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

export default AddFaq;