"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    imageAlt: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= HANDLERS ================= */
  
  // Generic handler for standard inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Specific handler for RichTextEditor
  const handleEditorChange = (val) => {
    setForm((prev) => ({
      ...prev,
      description: val,
    }));
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
    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (image) {
      fd.append("image", image);
    } else {
      toast.error("City thumbnail image is required");
      return;
    }

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 px-10 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New City</h2>
            <p className="text-gray-500 text-sm mt-1">Configure service areas and local details.</p>
          </div>
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <span className="text-xl">←</span> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">

          {/* SECTION: GENERAL INFO */}
          <Section title="Location Details" subtitle="Main naming and identification">
            <div className="grid md:grid-cols-2 gap-8">
              <Input 
                label="Main City Name" 
                name="mainCity"
                placeholder="e.g. Bangalore" 
                value={form.mainCity}
                onChange={handleInputChange} 
                required 
              />

              <Input 
                label="Permalink" 
                name="permalink"
                placeholder="call-girl-in" 
                value={form.permalink}
                onChange={handleInputChange} 
                required 
              />
              
              <Input 
                label="Page Heading" 
                name="heading"
                placeholder="e.g. Luxury Services in Bangalore" 
                value={form.heading}
                onChange={handleInputChange} 
              />

              <div className="md:col-span-2">
                <Textarea 
                  label="Sub Description" 
                  name="subDescription"
                  placeholder="Short intro text for the city page..." 
                  value={form.subDescription}
                  onChange={handleInputChange} 
                  rows={3} 
                />
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: CONTENT */}
          <Section title="Full Description" subtitle="Detailed information for the city page">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <RichTextEditor
                value={form.description}
                onChange={handleEditorChange}
              />
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: MEDIA */}
          <Section title="Media & Visuals" subtitle="Banner or thumbnail for the city">
            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Featured Image</label>
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
              />
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <Input 
                  label="Image Alt Text (SEO)" 
                  name="imageAlt"
                  placeholder="e.g. Bangalore Cityscape" 
                  value={form.imageAlt}
                  onChange={handleInputChange} 
                />
                
                {preview && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-md border-2 border-white">
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: SEO */}
          <Section title="SEO Optimization" subtitle="Rank this city page on search engines">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <Input 
                  label="SEO Meta Title" 
                  name="seoTitle"
                  placeholder="Bangalore's Top Rated Services | BrandName" 
                  value={form.seoTitle}
                  onChange={handleInputChange} 
                />
              </div>
              <Textarea 
                label="Meta Description" 
                name="seoDescription"
                placeholder="Briefly describe the city services for Google search results..." 
                value={form.seoDescription}
                onChange={handleInputChange} 
                rows={3} 
              />
              
              <Textarea 
                label="Meta Keywords" 
                name="seoKeywords"
                placeholder="bangalore, service, luxury, independent (comma separated)" 
                value={form.seoKeywords}
                onChange={handleInputChange} 
                rows={3} 
              />
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={addLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {addLoading ? "Saving Details..." : "Publish City"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

/* ================= REUSABLE UI COMPONENTS ================= */

const Section = ({ title, subtitle, children }) => (
  <div className="grid lg:grid-cols-4 gap-8">
    <div className="lg:col-span-1">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
    <div className="lg:col-span-3">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</label>
    <input 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</label>
    <textarea 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300" 
    />
  </div>
);

export default AddCity;