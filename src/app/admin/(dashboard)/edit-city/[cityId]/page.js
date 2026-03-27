"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";

import { getCitiesThunk, updateCityThunk } from "@/store/slices/citySlice";
import RichTextEditor from "@/components/RichTextEditor";

export default function EditCity() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const cityId = params?.cityId;

  const { cities, updateLoading } = useSelector((s) => s.city);

  const [initialLoaded, setInitialLoaded] = useState(false);
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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!cities?.length) return;
    const city = cities.find((c) => c._id === cityId);
    if (!city) return;

    setForm({
      mainCity: city.mainCity || "",
      heading: city.heading || "",
       permalink: city.permalink || "",
      subDescription: city.subDescription || "",
      description: city.description || "",
      seoTitle: city.seoTitle || "",
      seoDescription: city.seoDescription || "",
      seoKeywords: city.seoKeywords || "",
      imageAlt: city.imageAlt || "",

    });

    setPreview(city.imageUrl || null);
    setInitialLoaded(true);
  }, [cities, cityId]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    
    if (image) fd.append("image", image);

    const res = await dispatch(updateCityThunk({ cityId, formData: fd }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("City updated successfully!");
      router.push("/admin/all-cities");
    } else {
      toast.error("Failed to update city");
    }
  };

  if (!initialLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 px-10 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit City</h2>
            <p className="text-gray-500 text-sm mt-1">Update general information and SEO data for {form.mainCity}.</p>
          </div>
          <button 
            type="button"
            onClick={() => router.push("/admin/all-cities")}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-all border border-gray-200"
          >
            <span className="text-xl">←</span> Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">

          {/* SECTION: GENERAL INFO */}
          <Section title="Location Details" subtitle="Core identification and details">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="Main City Name" name="mainCity" value={form.mainCity} onChange={handleChange} required />
              <Input label="Page Heading" name="heading" value={form.heading} onChange={handleChange} placeholder="e.g. Best Services in Bangalore" />
<Input label="permalink" name="permalink" value={form.permalink} onChange={handleChange} placeholder="e.g. best india girl" />
              <div className="md:col-span-2">
                <Textarea label="Sub Description" name="subDescription" value={form.subDescription} onChange={handleChange} rows={3} placeholder="A short catchphrase or summary..." />
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: CONTENT */}
          <Section title="Full Description" subtitle="Detailed rich text content for the page">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <RichTextEditor
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val })}
              />
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: MEDIA */}
          <Section title="Media & Visuals" subtitle="Thumbnail and display image">
            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Featured Image</label>
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all" 
              />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <Input label="Image Alt Text (SEO)" name="imageAlt" value={form.imageAlt} onChange={handleChange} placeholder="Describe the image..." />
                
                {preview && (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: SEO */}
          <Section title="SEO Optimization" subtitle="Configure meta tags for Google ranking">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <Input label="SEO Meta Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="The title shown in search results" />
              </div>
              <Textarea label="Meta Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={3} placeholder="Summary for search engines..." />
              <Textarea label="Meta Keywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange} rows={3} placeholder="Comma-separated keywords..." />
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={updateLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {updateLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                "Update City Profile"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, subtitle, children }) => (
  <div className="grid lg:grid-cols-4 gap-8">
    <div className="lg:col-span-1">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm mt-1 leading-relaxed">{subtitle}</p>
    </div>
    <div className="lg:col-span-3">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</label>
    <input 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300 shadow-sm" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</label>
    <textarea 
      {...props} 
      className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300 shadow-sm" 
    />
  </div>
);