"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ArrowLeft, Save, Globe, MapPin, Building2, UserCircle, ChevronDown, Plus, Trash2 } from "lucide-react";

// Thunks
import { updateFaqThunk, getFaqsThunk } from "@/store/slices/faqSlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import { fetchSubCities } from "@/store/slices/subCitySlice";
import { getAllGirlsThunk } from "@/store/slices/girlSlice";

const EditFaq = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { faqs, loading } = useSelector((state) => state.faq);
  const { cities = [] } = useSelector((state) => state.city);
  const { subCities = [] } = useSelector((state) => state.subCity);
  const { girls = [] } = useSelector((state) => state.girls);

  /* ================= STATE ================= */
  const [config, setConfig] = useState({
    type: "homepage",
    city: "",
    subCity: "",
    girl: "",
    status: "Active",
  });

  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    // Agar faqs empty hai (refresh case), toh fetch karein
    if (faqs.length === 0) {
      dispatch(getFaqsThunk());
    }
    dispatch(getCitiesThunk());
    dispatch(fetchSubCities());
    dispatch(getAllGirlsThunk());
  }, [dispatch, faqs.length]);

  /* ================= SYNC DATA ================= */
  useEffect(() => {
    if (faqs.length > 0 && id) {
      const currentGroup = faqs.find((f) => f._id === id);
      if (currentGroup) {
        setConfig({
          type: currentGroup.type || "homepage",
          city: currentGroup.city?._id || currentGroup.city || "",
          subCity: currentGroup.subCity?._id || currentGroup.subCity || "",
          girl: currentGroup.girl?._id || currentGroup.girl || "",
          status: currentGroup.status || "Active",
        });
        
        // Deep copy of questions to avoid mutating state
        setFaqList(currentGroup.faqs.map(q => ({ ...q })) || [{ question: "", answer: "" }]);
        setIsDataLoaded(true);
      }
    }
  }, [faqs, id]);

  /* ================= HANDLERS ================= */
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
      // Clear specific IDs if type changes
      ...(name === "type" && { city: "", subCity: "", girl: "" }),
    }));
  };

  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...faqList];
    updated[index] = { ...updated[index], [name]: value };
    setFaqList(updated);
  };

  const addNewField = () => setFaqList([...faqList, { question: "", answer: "" }]);

  const removeField = (index) => {
    if (faqList.length > 1) {
      setFaqList(faqList.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      type: config.type,
      status: config.status,
      faqs: faqList.map(({ question, answer }) => ({ question, answer })), // clean data
      city: config.type === "city" ? config.city : null,
      subCity: config.type === "subcity" ? config.subCity : null,
      girl: config.type === "girl" ? config.girl : null,
    };

    try {
      await dispatch(updateFaqThunk({ id, data: updateData })).unwrap();
      router.push("/admin/all-faq");
    } catch (err) {
      alert(err || "Failed to update FAQ");
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

  if (loading && !isDataLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 shadow-sm transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Edit FAQ Group</h1>
            <p className="text-gray-500 text-sm">Update questions or target placement for this group.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PLACEMENT CONFIG */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Placement Type</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 z-10">{getTypeIcon()}</div>
                    <select
                      name="type"
                      value={config.type}
                      onChange={handleConfigChange}
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none outline-none"
                    >
                      <option value="homepage">Homepage</option>
                      <option value="city">City Page</option>
                      <option value="subcity">Sub-City Page</option>
                      <option value="girl">Girl Profile</option>
                    </select>
                    <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {config.type !== "homepage" && (
                    <motion.div key={config.type} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      {config.type === "city" && <Dropdown label="Select City" name="city" value={config.city} onChange={handleConfigChange} options={cities} labelKey="mainCity" />}
                      {config.type === "subcity" && <Dropdown label="Select Sub-City" name="subCity" value={config.subCity} onChange={handleConfigChange} options={subCities} labelKey="name" />}
                      {config.type === "girl" && <Dropdown label="Select Profile" name="girl" value={config.girl} onChange={handleConfigChange} options={girls} labelKey="name" />}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {/* DYNAMIC Q&A FIELDS */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Questions & Answers</h3>
               <button type="button" onClick={addNewField} className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline">
                  <Plus className="w-4 h-4" /> Add Question
               </button>
            </div>

            <AnimatePresence>
              {faqList.map((faq, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative">
                   <button type="button" onClick={() => removeField(index)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                   </button>
                   <div className="space-y-4">
                      <input
                        type="text"
                        name="question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Edit question..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        required
                      />
                      <textarea
                        name="answer"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Edit answer..."
                        rows={3}
                        className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl outline-none transition-all font-medium resize-none"
                        required
                      />
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SAVE ACTIONS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between sticky bottom-8 z-20">
             <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-12 h-6 rounded-full transition-all relative ${config.status === "Active" ? "bg-pink-600" : "bg-gray-200"}`}>
                   <input type="checkbox" className="hidden" checked={config.status === "Active"} onChange={(e) => setConfig(p => ({ ...p, status: e.target.checked ? "Active" : "Inactive" }))} />
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.status === "Active" ? "left-7" : "left-1"}`} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{config.status}</span>
             </label>

             <button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transition-all active:scale-95 disabled:bg-gray-300">
                {loading ? "Updating..." : "Update FAQ Group"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Helper Dropdown Component */
const Dropdown = ({ label, name, value, onChange, options, labelKey }) => (
  <div className="relative flex flex-col">
    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}</label>
    <div className="relative flex items-center">
      <select name={name} value={value} onChange={onChange} required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all appearance-none outline-none">
        <option value="">-- Choose Option --</option>
        {options.map((o) => <option key={o._id} value={o._id}>{o[labelKey]}</option>)}
      </select>
      <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

export default EditFaq;