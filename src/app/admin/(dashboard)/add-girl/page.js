"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { addGirlThunk } from "@/store/slices/girlSlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import RichTextEditor from "@/components/RichTextEditor";

import { FormControl, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from "@mui/material";

const AddGirlForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cities = [] } = useSelector((state) => state.city);
  const { addLoading } = useSelector((state) => state.girls);

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    heading: "",
    city: [],
    description: "",
    priceDetails: "",
    aboutGirlInformation: "",
    phoneNumber: "",
    whatsappNumber: "",
    imageAlt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    showOnHomepage: false,
    permalink: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewGallery, setPreviewGallery] = useState([]);

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCityChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      city: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else if (file) {
      alert("Please select a valid image file.");
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    // Filter to ensure only images are added to state
    const validImages = files.filter(file => file.type.startsWith("image/"));
    
    if (validImages.length === 0) return;

    setImagesFiles((prev) => [...prev, ...validImages]);
    const newPreviews = validImages.map((f) => URL.createObjectURL(f));
    setPreviewGallery((prev) => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  const removeGalleryImage = (index) => {
    setImagesFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewGallery((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    const formatPhone = (val) => {
      if (!val) return "";
      return val.startsWith("+91") ? val : `+91${val.replace(/\D/g, "")}`;
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "city") {
        value.forEach((cityId) => fd.append("city", cityId));
      } else if (key === "phoneNumber" || key === "whatsappNumber") {
        fd.append(key, formatPhone(value));
      } else if (key === "seoKeywords") {
        fd.append("seoKeywords", value || "");
      } else {
        fd.append(key, value);
      }
    });

    if (imageFile) fd.append("image", imageFile);
    imagesFiles.forEach((file) => fd.append("images", file));

    const res = await dispatch(addGirlThunk(fd));
    if (!res.error) {
      router.push("/admin/model-girl");
    }
  };

  useEffect(() => {
    if (formData.name && !formData.permalink) {
      setFormData((prev) => ({
        ...prev,
        permalink: formData.name.toLowerCase().trim().replace(/\s+/g, "-"),
      }));
    }
  }, [formData.name]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

        <div className="bg-white border-b border-gray-100 px-10 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details below to list a new model.</p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-pink-600 font-medium transition-colors"
          >
            <span className="text-xl">←</span> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">

          {/* SECTION: IDENTITY */}
          <Section title="Identity" subtitle="Essential public details">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Khushi" required />
              <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g. 24" required />

              <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="9876543210" required />
              <Input label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="Optional (defaults to Phone)" />

              <div className="md:col-span-2">
                <Input label="Profile Heading" name="heading" value={formData.heading} onChange={handleChange} placeholder="Ex: Beautiful Independent Model" required />
                <Input
                  label="Permalink (SEO URL)"
                  name="permalink"
                  value={formData.permalink}
                  onChange={handleChange}
                  placeholder="e.g. best-girl-in-india"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Cities</label>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={formData.city}
                    onChange={handleCityChange}
                    input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
                    renderValue={(selected) => (
                      <div className="flex flex-wrap gap-1">
                        {selected.map((value) => {
                          const cityName = cities.find(c => c._id === value)?.mainCity;
                          return (
                            <span key={value} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-semibold">
                              {cityName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  >
                    {cities.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        <Checkbox checked={formData.city.indexOf(c._id) > -1} size="small" color="secondary" />
                        <ListItemText primary={c.mainCity} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: CONTENT */}
          <Section title="Bio & Pricing" subtitle="Detailed information and rates">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Textarea label="Short Description" name="description" value={formData.description} onChange={handleChange} rows={4} />
                <Textarea label="Pricing Details" name="priceDetails" value={formData.priceDetails} onChange={handleChange} rows={4} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Detailed Bio (Rich Text)</label>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <RichTextEditor
                    value={formData.aboutGirlInformation}
                    onChange={(val) => setFormData((prev) => ({ ...prev, aboutGirlInformation: val }))}
                  />
                </div>
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: MEDIA */}
          <Section title="Media" subtitle="Upload profile and gallery images">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Main Image Input with accept="image/*" */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Main Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700 cursor-pointer" 
                />
                <div className="mt-4">
                  <Input label="Image Alt Text (SEO)" name="imageAlt" value={formData.imageAlt} onChange={handleChange} placeholder="e.g. Khushi Profile Photo" />
                </div>
                {previewImage && (
                  <div className="mt-4 w-32 h-40">
                    <img src={previewImage} className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white" alt="Preview" />
                  </div>
                )}
              </div>

              {/* Gallery Images Input with accept="image/*" */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Gallery Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImagesChange} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-black cursor-pointer" 
                />
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {previewGallery.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={img} className="w-full h-full object-cover rounded-xl shadow-sm border border-white" alt={`Gallery ${i}`} />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: SEO */}
          <Section title="Search Engine" subtitle="Optimize for Google ranking">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="SEO Title" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="SEO Title" />
              <Input label="SEO Keywords" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} placeholder="Keywords (comma separated)" />
              <div className="md:col-span-2">
                <Textarea label="SEO Description" name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} />
              </div>
            </div>
          </Section>

          <div className="pt-8 border-t border-gray-100 flex justify-end items-center gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="showOnHomepage"
                checked={formData.showOnHomepage}
                onChange={handleChange}
                className="w-5 h-5 accent-pink-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600">Pin to Homepage</span>
            </div>
            <button
              type="submit"
              disabled={addLoading}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {addLoading ? "Processing..." : "Publish Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Section = ({ title, subtitle, children }) => (
  <div className="grid lg:grid-cols-4 gap-6">
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
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-gray-300"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">{label}</label>
    <textarea
      {...props}
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-gray-300"
    />
  </div>
);

export default AddGirlForm;
