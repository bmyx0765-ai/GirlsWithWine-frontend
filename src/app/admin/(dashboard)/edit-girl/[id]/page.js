"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";

// Thunks
import { updateGirlThunk, getGirlByIdThunk } from "@/store/slices/girlSlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import { fetchSubCities } from "@/store/slices/subCitySlice";
import RichTextEditor from "@/components/RichTextEditor";

import { FormControl, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from "@mui/material";

const EditGirlForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { singleGirl, loading } = useSelector((state) => state.girls);
  const { cities = [] } = useSelector((state) => state.city);
  const { subCities = [] } = useSelector((state) => state.subCity);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    heading: "",
    city: [],
    subCity: [], // Keep as array for Multi-select UI compatibility
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
  const [existingGallery, setExistingGallery] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getGirlByIdThunk(id));
    }
    dispatch(getCitiesThunk());
    dispatch(fetchSubCities());
  }, [dispatch, id]);

  useEffect(() => {
    if (singleGirl && (singleGirl._id === id || singleGirl.id === id)) {
      // FIX: Handle subCity as Object or Array based on API response
      const normalizedSubCity = singleGirl.subCity 
        ? (Array.isArray(singleGirl.subCity) 
            ? singleGirl.subCity.map(sc => sc._id || sc) 
            : [singleGirl.subCity._id || singleGirl.subCity])
        : [];

      setFormData({
        name: singleGirl.name || "",
        age: singleGirl.age || "",
        heading: singleGirl.heading || "",
        city: Array.isArray(singleGirl.city) ? singleGirl.city.map((c) => c._id || c) : [],
        subCity: normalizedSubCity, // Synced with API Object structure
        description: singleGirl.description || "",
        priceDetails: singleGirl.priceDetails || "",
        aboutGirlInformation: singleGirl.aboutGirlInformation || "",
        phoneNumber: singleGirl.phoneNumber || "",
        whatsappNumber: singleGirl.whatsappNumber || "",
        imageAlt: singleGirl.imageAlt || "",
        seoTitle: singleGirl.seoTitle || "",
        seoDescription: singleGirl.seoDescription || "",
        // SEO Keywords handling for Array vs String
        seoKeywords: Array.isArray(singleGirl.seoKeywords) 
          ? singleGirl.seoKeywords.join(", ") 
          : singleGirl.seoKeywords || "",
        showOnHomepage: singleGirl.showOnHomepage || false,
        permalink: singleGirl.permalink || "",
      });
      setPreviewImage(singleGirl.imageUrl);
      setExistingGallery(singleGirl.images || []);
      setIsDataLoaded(true);
    }
  }, [singleGirl, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith("image/"));
    setImagesFiles((prev) => [...prev, ...validImages]);
    const newPreviews = validImages.map((f) => URL.createObjectURL(f));
    setPreviewGallery((prev) => [...prev, ...newPreviews]);
    e.target.value = null; 
  };

  const removeNewGalleryImage = (index) => {
    setImagesFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (url) => {
    setExistingGallery((prev) => prev.filter((item) => item !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "city" || key === "subCity") {
        if (Array.isArray(value)) {
          value.forEach((val) => fd.append(key, val));
        }
      } else if (key === "seoKeywords") {
        // Convert comma string back to array if backend expects array
        fd.append(key, value); 
      } else {
        fd.append(key, value);
      }
    });

    if (imageFile) fd.append("image", imageFile);
    imagesFiles.forEach((file) => fd.append("images", file));
    fd.append("existingImages", JSON.stringify(existingGallery));

    try {
      await dispatch(updateGirlThunk({ id, formData: fd })).unwrap();
      router.push("/admin/model-girl");
    } catch (err) {
      alert(err || "Failed to update profile");
    }
  };

  if (!isDataLoaded && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="bg-white border-b border-gray-100 px-10 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Profile</h2>
          </div>
          <button type="button" onClick={() => router.back()} className="text-gray-600 font-medium">← Back</button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">
          <Section title="Identity & Location">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="NAME" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="AGE" name="age" type="number" value={formData.age} onChange={handleChange} required />
              <Input label="PHONE" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              <Input label="WHATSAPP" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />

              {/* Main Cities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">MAIN CITIES</label>
                <Select
                  name="city"
                  multiple
                  value={formData.city}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
                  renderValue={(selected) => (
                    <div className="flex flex-wrap gap-1">
                      {selected.map((val) => (
                        <span key={val} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                          {cities.find((c) => c._id === val)?.mainCity || "City"}
                        </span>
                      ))}
                    </div>
                  )}
                >
                  {cities.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      <Checkbox checked={formData.city.indexOf(c._id) > -1} />
                      <ListItemText primary={c.mainCity} />
                    </MenuItem>
                  ))}
                </Select>
              </div>

              {/* Sub Cities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">SUB CITIES</label>
                <Select
                  name="subCity"
                  multiple
                  value={formData.subCity}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
                  renderValue={(selected) => (
                    <div className="flex flex-wrap gap-1">
                      {selected.map((val) => (
                        <span key={val} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {subCities.find((sc) => sc._id === val)?.name || "Sub City"}
                        </span>
                      ))}
                    </div>
                  )}
                >
                  {subCities.map((sc) => (
                    <MenuItem key={sc._id} value={sc._id}>
                      <Checkbox checked={formData.subCity.indexOf(sc._id) > -1} />
                      <ListItemText primary={`${sc.name} (${sc.mainCity?.mainCity || 'N/A'})`} />
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className="md:col-span-2">
                <Input label="HEADING" name="heading" value={formData.heading} onChange={handleChange} required />
                <Input label="PERMALINK" name="permalink" value={formData.permalink} onChange={handleChange} required />
              </div>
            </div>
          </Section>

         {/* Bio & Pricing Section */}
<Section title="Bio & Pricing">
  <div className="space-y-8">
    <div className="grid md:grid-cols-2 gap-8">
      <Textarea label="SHORT BIO" name="description" value={formData.description} onChange={handleChange} />
      <Textarea label="RATES" name="priceDetails" value={formData.priceDetails} onChange={handleChange} />
    </div>

    {/* Yahan fix hai: Jab tak data load na ho, editor render mat karein */}
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-gray-700">DETAILED BIO (RICH TEXT)</label>
      <div className="rounded-xl overflow-hidden border">
        {isDataLoaded ? (
          <RichTextEditor
            value={formData.aboutGirlInformation}
            onChange={(val) => setFormData(p => ({ ...p, aboutGirlInformation: val }))}
          />
        ) : (
          <div className="p-10 text-center text-gray-400">Loading editor content...</div>
        )}
      </div>
    </div>
  </div>
</Section>

          <Section title="Media">
             <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-bold mb-2">MAIN IMAGE</label>
                  <input type="file" onChange={handleImageChange} />
                  {previewImage && <img src={previewImage} className="mt-4 w-32 rounded-lg" />}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-bold mb-2">GALLERY</label>
                  <input type="file" multiple onChange={handleImagesChange} />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {existingGallery.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} className="w-full h-20 object-cover rounded" />
                        <button type="button" onClick={() => removeExistingGalleryImage(img)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </Section>

          <Section title="SEO">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="SEO TITLE" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
              <Input label="SEO KEYWORDS" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} />
              <div className="md:col-span-2">
                <Textarea label="SEO DESCRIPTION" name="seoDescription" value={formData.seoDescription} onChange={handleChange} />
              </div>
            </div>
          </Section>

          <div className="flex justify-end items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="showOnHomepage" checked={formData.showOnHomepage} onChange={handleChange} />
              Pin to Homepage
            </label>
            <button type="submit" disabled={loading} className="bg-pink-600 text-white px-10 py-3 rounded-xl font-bold">
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="grid lg:grid-cols-4 gap-6">
    <div className="lg:col-span-1"><h3 className="text-xl font-bold">{title}</h3></div>
    <div className="lg:col-span-3">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input {...props} className="w-full bg-gray-50 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <textarea {...props} className="w-full bg-gray-50 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
  </div>
);

export default EditGirlForm;