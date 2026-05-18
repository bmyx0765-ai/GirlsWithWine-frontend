"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiMapPin, FiType, FiSearch, FiImage, FiHash,
  FiActivity, FiChevronLeft, FiUpload, FiSave, FiShare2, FiFacebook, FiTwitter
} from "react-icons/fi";

import { getCitiesThunk, updateCityThunk } from "@/store/slices/citySlice";
import RichTextEditor from "@/components/RichTextEditor";

const EditCity = () => {
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
    tags: "", 
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    // Social SEO Fields synced with AddCity
    ogTitle: "",
    ogDescription: "",
    twitterTitle: "",
    twitterDescription: "",
    facebookTitle: "",
    facebookDescription: "",
    imageAlt: "",
    status: "Active",
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
      permalink: city.permalink || "",
      heading: city.heading || "",
      subDescription: city.subDescription || "",
      description: city.description || "",
      tags: Array.isArray(city.tags) ? city.tags.join(", ") : city.tags || "",
      seoTitle: city.seoTitle || "",
      seoDescription: city.seoDescription || "",
      seoKeywords: city.seoKeywords || "",
      // Populate Social Fields from DB
      ogTitle: city.ogTitle || "",
      ogDescription: city.ogDescription || "",
      twitterTitle: city.twitterTitle || "",
      twitterDescription: city.twitterDescription || "",
      facebookTitle: city.facebookTitle || "",
      facebookDescription: city.facebookDescription || "",
      imageAlt: city.imageAlt || "",
      status: city.status || "Active",
    });

    setPreview(city.imageUrl || null);
    setInitialLoaded(true);
  }, [cities, cityId]);

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

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const fd = new FormData();

    Object.entries(form).forEach(
      ([key, value]) => {

        if (key === "tags") {

          const tagArray = value
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "");

          tagArray.forEach((tag) =>
            fd.append("tags[]", tag)
          );

        } else {

          fd.append(
            key,
            value || ""
          );
        }
      }
    );

    // IMAGE
    if (image) {

      fd.append(
        "image",
        image
      );
    }

    // DEBUG
    for (let pair of fd.entries()) {
      console.log(
        pair[0],
        pair[1]
      );
    }

    const res = await dispatch(
      updateCityThunk({
        cityId,
        formData: fd,
      })
    );

    console.log(res);

    if (
      res.meta.requestStatus ===
      "fulfilled"
    ) {

      toast.success(
        "City updated successfully!"
      );

      router.push(
        "/admin/all-cities"
      );

    } else {

      toast.error(
        res.payload?.message ||
        "Update failed"
      );
    }

  } catch (error) {

    console.log(error);

    toast.error(
      "Something went wrong"
    );
  }
};

  if (!initialLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit City Profile</h1>
            <p className="text-slate-500 mt-1">Modify parameters and social metadata for {form.mainCity}.</p>
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
                <Input label="Main City Name" name="mainCity" value={form.mainCity} onChange={handleInputChange} disabled required />
                <Input label="Permalink (Slug)" name="permalink" value={form.permalink} onChange={handleInputChange} disabled required />
                <div className="md:col-span-2">
                  <Input label="Page Display Heading" name="heading" value={form.heading} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <Textarea label="Short Sub-Description (Optional)" name="subDescription" value={form.subDescription} onChange={handleInputChange} rows={2} />
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
                  <RichTextEditor value={form.description} onChange={handleEditorChange} />
                </div>
              </div>
            </div>

            {/* SECTION: SEO & SOCIAL META */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiSearch /> Search Engine Optimization
              </div>
              <div className="p-8 space-y-6">
                <Input label="SEO Meta Title" name="seoTitle" value={form.seoTitle} onChange={handleInputChange} />
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea label="Meta Description" name="seoDescription" value={form.seoDescription} onChange={handleInputChange} rows={3} />
                  <Textarea label="Meta Keywords (Max 10)" name="seoKeywords" value={form.seoKeywords} rows={3} 
                    onChange={(e) => {
                      const value = e.target.value;
                      const keywords = value.split(",").map((k) => k.trim()).filter((k) => k !== "");
                      if (keywords.length <= 10) setForm((prev) => ({ ...prev, seoKeywords: value }));
                      else toast.error("Only 10 keywords allowed");
                    }} 
                  />
                </div>

                <hr className="border-slate-100 my-6" />

                {/* SOCIAL MEDIA FIELDS */}
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <FiShare2 className="text-blue-500" /> Social Media Previews
                </div>
                
                <div className="grid md:grid-cols-1 gap-6">
                  {/* Facebook / OG */}
                  <div className="space-y-4 p-6 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <FiFacebook className="text-blue-600" /> Facebook / Open Graph
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="OG Title" name="ogTitle" placeholder="Facebook share title" value={form.ogTitle} onChange={handleInputChange} />
                        <Input label="FB Specific Title" name="facebookTitle" placeholder="Custom Facebook title" value={form.facebookTitle} onChange={handleInputChange} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Textarea label="OG Description" name="ogDescription" placeholder="Social description..." value={form.ogDescription} onChange={handleInputChange} rows={2} />
                        <Textarea label="Facebook Description" name="facebookDescription" placeholder="Custom Facebook description..." value={form.facebookDescription} onChange={handleInputChange} rows={2} />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div className="space-y-4 p-6 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <FiTwitter className="text-sky-500" /> Twitter Card
                    </div>
                    <Input label="Twitter Title" name="twitterTitle" placeholder="Twitter share title" value={form.twitterTitle} onChange={handleInputChange} />
                    <Textarea label="Twitter Description" name="twitterDescription" placeholder="Twitter summary..." value={form.twitterDescription} onChange={handleInputChange} rows={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-4 space-y-8">
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
                disabled={updateLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updateLoading ? "Updating..." : <><FiSave /> Update Changes</>}
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
                <Input label="Image Alt (SEO)" name="imageAlt" placeholder="e.g. City Image Alt" value={form.imageAlt} onChange={handleInputChange} />
              </div>
            </div>

            {/* TAGS CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-blue-600 font-bold">
                <FiHash /> Tags
              </div>
              <div className="p-6">
                <Textarea label="Tags (Comma Separated)" name="tags" placeholder="jaipur, luxury..." value={form.tags} onChange={handleInputChange} rows={2} />
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
      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed" 
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

export default EditCity;