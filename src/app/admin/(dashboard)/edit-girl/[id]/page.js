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
    subCity: [],
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
        subCity: normalizedSubCity,
        description: singleGirl.description || "",
        priceDetails: singleGirl.priceDetails || "",
        aboutGirlInformation: singleGirl.aboutGirlInformation || "",
        phoneNumber: singleGirl.phoneNumber || "",
        whatsappNumber: singleGirl.whatsappNumber || "",
        imageAlt: singleGirl.imageAlt || "",
        seoTitle: singleGirl.seoTitle || "",
        seoDescription: singleGirl.seoDescription || "",
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

    // FIX: Dummy values filter karein taaki state array clean rahe
    if (value.includes("all-cities") || value.includes("all-subcities")) {
        return;
    }

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

  /* ================= SELECT ALL LOGIC (FIXED) ================= */

  const isAllCitiesSelected = cities.length > 0 && formData.city.length === cities.length;
  const isAllSubCitiesSelected = subCities.length > 0 && formData.subCity.length === subCities.length;

  const handleSelectAllCities = (e) => {
    e.stopPropagation();
    const allCityIds = cities.map((c) => c._id);
    setFormData((prev) => ({
      ...prev,
      city: isAllCitiesSelected ? [] : allCityIds,
    }));
  };

  const handleSelectAllSubCities = (e) => {
    e.stopPropagation();
    const allSubCityIds = subCities.map((sc) => sc._id);
    setFormData((prev) => ({
      ...prev,
      subCity: isAllSubCitiesSelected ? [] : allSubCityIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "city" || key === "subCity") {
        if (Array.isArray(value)) {
          value.forEach((val) => fd.append(key, val));
        }
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
          <button type="button" onClick={() => router.back()} className="text-gray-600 font-medium hover:text-pink-600">← Back</button>
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
                <label className="text-sm font-bold text-gray-700 uppercase">Main Cities</label>
                <FormControl fullWidth size="small">
                  <Select
                    name="city"
                    multiple
                    value={formData.city}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
                    MenuProps={{ PaperProps: { style: { maxHeight: 400 } } }}
                    renderValue={(selected) => (
                      <div className="flex flex-wrap gap-1">
                        {selected.map((val) => (
                          <span key={val} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-semibold">
                            {cities.find((c) => c._id === val)?.mainCity || "City"}
                          </span>
                        ))}
                      </div>
                    )}
                  >
                    <MenuItem 
                        value="all-cities" 
                        onClick={handleSelectAllCities}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="bg-gray-100 sticky top-0 z-10"
                    >
                      <Checkbox 
                        checked={isAllCitiesSelected} 
                        indeterminate={formData.city.length > 0 && !isAllCitiesSelected}
                        color="secondary" 
                      />
                      <ListItemText primary="Select All Cities" primaryTypographyProps={{ fontWeight: "bold" }} />
                    </MenuItem>

                    {cities.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        <Checkbox checked={formData.city.includes(c._id)} color="secondary" />
                        <ListItemText primary={c.mainCity} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Sub Cities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700 uppercase">Sub Cities</label>
                <FormControl fullWidth size="small">
                  <Select
                    name="subCity"
                    multiple
                    value={formData.subCity}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
                    MenuProps={{ PaperProps: { style: { maxHeight: 400 } } }}
                    renderValue={(selected) => (
                      <div className="flex flex-wrap gap-1">
                        {selected.map((val) => (
                          <span key={val} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                            {subCities.find((sc) => sc._id === val)?.name || "Sub City"}
                          </span>
                        ))}
                      </div>
                    )}
                  >
                    <MenuItem 
                        value="all-subcities" 
                        onClick={handleSelectAllSubCities}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="bg-gray-100 sticky top-0 z-10"
                    >
                      <Checkbox 
                        checked={isAllSubCitiesSelected} 
                        indeterminate={formData.subCity.length > 0 && !isAllSubCitiesSelected}
                        color="primary" 
                      />
                      <ListItemText primary="Select All Sub Cities" primaryTypographyProps={{ fontWeight: "bold" }} />
                    </MenuItem>

                    {subCities.map((sc) => (
                      <MenuItem key={sc._id} value={sc._id}>
                        <Checkbox checked={formData.subCity.includes(sc._id)} color="primary" />
                        <ListItemText primary={`${sc.name} (${sc.mainCity?.mainCity || "N/A"})`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Input label="HEADING" name="heading" value={formData.heading} onChange={handleChange} required />
                <Input label="PERMALINK (READ ONLY)" name="permalink" value={formData.permalink} onChange={handleChange} required disabled />
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700 uppercase">Detailed Bio (Rich Text)</label>
                <div className="rounded-xl overflow-hidden border">
                  {isDataLoaded ? (
                    <RichTextEditor
                      value={formData.aboutGirlInformation}
                      onChange={(val) => setFormData(p => ({ ...p, aboutGirlInformation: val }))}
                    />
                  ) : (
                    <div className="p-10 text-center text-gray-400 italic">Loading editor content...</div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Media Section */}
          <Section title="Media">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                <label className="block text-sm font-bold mb-4 uppercase">Main Featured Image</label>
                <input type="file" onChange={handleImageChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-600 file:text-white" />
                {previewImage && <img src={previewImage} className="mt-4 w-32 h-40 object-cover rounded-xl shadow-md border-2 border-white" alt="Main Preview" />}
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                <label className="block text-sm font-bold mb-4 uppercase">Existing Gallery</label>
                <input type="file" multiple onChange={handleImagesChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-white mb-4" />
                
                {/* Existing Images */}
                <div className="grid grid-cols-3 gap-3">
                  {existingGallery.map((img, i) => (
                    <div key={`existing-${i}`} className="relative aspect-square">
                      <img src={img} className="w-full h-full object-cover rounded-xl" />
                      <button type="button" onClick={() => removeExistingGalleryImage(img)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">✕</button>
                    </div>
                  ))}
                  {/* New Previews */}
                  {previewGallery.map((img, i) => (
                    <div key={`new-${i}`} className="relative aspect-square">
                      <img src={img} className="w-full h-full object-cover rounded-xl border-2 border-blue-400" />
                      <button type="button" onClick={() => removeNewGalleryImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* SEO Section */}
          <Section title="SEO Settings">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="SEO TITLE" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
              <Input label="SEO KEYWORDS" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} placeholder="comma, separated, keywords" />
              <div className="md:col-span-2">
                <Textarea label="SEO DESCRIPTION" name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} />
              </div>
            </div>
          </Section>

          {/* Footer actions */}
          <div className="pt-10 border-t flex justify-end items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="showOnHomepage" checked={formData.showOnHomepage} onChange={handleChange} className="w-5 h-5 accent-pink-600" />
              <span className="text-sm font-semibold text-gray-700">Pin to Homepage</span>
            </label>
            <button 
                type="submit" 
                disabled={loading} 
                className="bg-pink-600 hover:bg-pink-700 text-white px-12 py-4 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? "Updating Profile..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="grid lg:grid-cols-4 gap-6">
    <div className="lg:col-span-1">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
    </div>
    <div className="lg:col-span-3">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700 tracking-wide">{label}</label>
    <input {...props} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-gray-300" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-gray-700 tracking-wide">{label}</label>
    <textarea {...props} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none placeholder:text-gray-300" />
  </div>
);

export default EditGirlForm;