"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiMapPin, FiType, FiSearch, FiImage, FiHash, FiActivity, FiChevronLeft } from "react-icons/fi";

import { addCityThunk, resetCityState } from "@/store/slices/citySlice";
import RichTextEditor from "@/components/RichTextEditor";

const AddCity = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { addLoading, success } = useSelector((s) => s.city);

  const [form, setForm] = useState({
    mainCity: "",
    permalink: "",
    heading: "",
    subDescription: "",
    description: "",
    tags: "", // Will be sent as comma-separated and handled in submit
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    imageAlt: "",
    status: "Active",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (val) => {
    setForm((prev) => ({ ...prev, description: val }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!image) {
      return toast.error("City thumbnail image is required");
    }

    const fd = new FormData();

    // Append all form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === "tags") {
        // Handle tags: Convert comma string to array or append individually
        const tagArray = value.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
        tagArray.forEach(tag => fd.append("tags[]", tag)); 
      } else {
        fd.append(key, value);
      }
    });

    fd.append("image", image);

    dispatch(addCityThunk(fd));
  };

  /* ================= SUCCESS ================= */
  useEffect(() => {
    if (success) {
      toast.success("City added successfully!");
      dispatch(resetCityState());
      router.push("/admin/all-cities");
    }
  }, [success, dispatch, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New City</h1>
            <p className="text-slate-500 mt-1">Define location parameters, SEO, and visual assets.</p>
          </div>
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold"
          >
            <FiChevronLeft /> Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION: GENERAL INFO */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiMapPin /> Basic Identity
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <Input 
                  label="Main City Name" 
                  name="mainCity"
                  placeholder="e.g. Jaipur" 
                  value={form.mainCity}
                  onChange={handleInputChange} 
                  required 
                />
                <Input 
                  label="Permalink (Slug)" 
                  name="permalink"
                  placeholder="escorts-in-jaipur" 
                  value={form.permalink}
                  onChange={handleInputChange} 
                  required 
                />
                <div className="md:col-span-2">
                  <Input 
                    label="Page Display Heading" 
                    name="heading"
                    placeholder="Luxury Services in Jaipur" 
                    value={form.heading}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea 
                    label="Short Sub-Description" 
                    name="subDescription"
                    placeholder="Short intro text for listing cards..." 
                    value={form.subDescription}
                    onChange={handleInputChange} 
                    rows={2} 
                  />
                </div>
              </div>
            </div>

            {/* SECTION: CONTENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiType /> Rich Content Description
              </div>
              <div className="p-8">
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <RichTextEditor
                    value={form.description}
                    onChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>

            {/* SECTION: SEO */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiSearch /> SEO Optimization
              </div>
              <div className="p-8 space-y-6">
                <Input 
                  label="SEO Meta Title" 
                  name="seoTitle"
                  placeholder="Title for Google Search" 
                  value={form.seoTitle}
                  onChange={handleInputChange} 
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea 
                    label="Meta Description" 
                    name="seoDescription"
                    placeholder="Brief summary for SERP..." 
                    value={form.seoDescription}
                    onChange={handleInputChange} 
                    rows={3} 
                  />
                  <Textarea 
                    label="Meta Keywords" 
                    name="seoKeywords"
                    placeholder="keyword1, keyword2..." 
                    value={form.seoKeywords}
                    onChange={handleInputChange} 
                    rows={3} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* PUBLISH CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <FiActivity className="text-green-500" /> Status & Visibility
               </div>
               <select 
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-6"
               >
                 <option value="Active">Active</option>
                 <option value="Inactive">Inactive</option>
               </select>
               <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {addLoading ? "Processing..." : "Publish City"}
              </button>
            </div>

            {/* MEDIA CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiImage /> Visual Assets
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Featured Image</label>
                   <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden relative group">
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center">
                        <FiUpload className="mx-auto text-slate-300 text-3xl mb-2" />
                        <p className="text-xs text-slate-400">Click to upload</p>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                <Input 
                  label="Image Alt (SEO)" 
                  name="imageAlt"
                  placeholder="e.g. City Escort Services" 
                  value={form.imageAlt}
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* TAGS CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiHash /> Tags
              </div>
              <div className="p-6">
                <Textarea 
                  label="Tags (Comma Separated)" 
                  name="tags"
                  placeholder="jaipur, luxury, premium..." 
                  value={form.tags}
                  onChange={handleInputChange} 
                  rows={2} 
                />
                <p className="text-[10px] text-slate-400 mt-2 italic">These will be stored as an array in the database.</p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

/* ================= REUSABLE UI COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
    <input 
      {...props} 
      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
    <textarea 
      {...props} 
      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm" 
    />
  </div>
);

const FiUpload = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

export default AddCity;