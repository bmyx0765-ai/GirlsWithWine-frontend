"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// Thunks
import { addGirlThunk } from "@/store/slices/girlSlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import { fetchSubCities } from "@/store/slices/subCitySlice";

// Components
import RichTextEditor from "@/components/RichTextEditor";
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Checkbox, 
  ListItemText, 
  OutlinedInput 
} from "@mui/material";

const AddGirlForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Selectors
  const { cities = [] } = useSelector((state) => state.city);
  const { subCities = [] } = useSelector((state) => state.subCity);
  const { addLoading } = useSelector((state) => state.girls);

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    heading: "",
    city: [],             // Array of Main City IDs
    subCity: [],          // Array of Sub-City IDs
    description: "",      // Short Description
    priceDetails: "",     // Rates/Pricing details
    aboutGirlInformation: "", // Detailed Bio (Rich Text)
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

  /* ================= API CALLS ================= */
  useEffect(() => {
    dispatch(getCitiesThunk());
    dispatch(fetchSubCities());
  }, [dispatch]);

  /* ================= AUTO SLUG GENERATION ================= */
  useEffect(() => {
    if (formData.name && !formData.permalink) {
      setFormData((prev) => ({
        ...prev,
        permalink: formData.name.toLowerCase().trim().replace(/\s+/g, "-"),
      }));
    }
  }, [formData.name]);

  /* ================= HANDLERS ================= */
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
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    
    if (validImages.length === 0) return;

    setImagesFiles((prev) => [...prev, ...validImages]);
    const newPreviews = validImages.map((f) => URL.createObjectURL(f));
    setPreviewGallery((prev) => [...prev, ...newPreviews]);
    e.target.value = null; // reset input
  };

  const removeGalleryImage = (index) => {
    setImagesFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewGallery((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    // Utility to format phone to Indian standard if needed
    const formatPhone = (val) => {
      if (!val) return "";
      const cleaned = val.replace(/\D/g, "");
      return val.startsWith("+91") ? val : `+91${cleaned}`;
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "city" || key === "subCity") {
        // Correct way to send multiple IDs in FormData
        value.forEach((id) => fd.append(key, id));
      } else if (key === "phoneNumber" || key === "whatsappNumber") {
        fd.append(key, formatPhone(value));
      } else {
        fd.append(key, value);
      }
    });

    if (imageFile) fd.append("image", imageFile);
    imagesFiles.forEach((file) => fd.append("images", file));

    const res = await dispatch(addGirlThunk(fd));
    if (res.meta.requestStatus === "fulfilled") {
      router.push("/admin/model-girl");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
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
          
          {/* SECTION: IDENTITY & LOCATION */}
          <Section title="Identity & Location" subtitle="Basic details and geo-mapping">
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="NAME" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required />
              <Input label="AGE" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Enter age" required />
              <Input label="PHONE" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone number" required />
              <Input label="WHATSAPP" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="WhatsApp (Optional)" />

              {/* MAIN CITY DROPDOWN */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Main Cities</label>
                <FormControl fullWidth size="small">
                  <Select
                    name="city"
                    multiple
                    value={formData.city}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
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
                    {cities.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        <Checkbox checked={formData.city.indexOf(c._id) > -1} size="small" color="secondary" />
                        <ListItemText primary={c.mainCity} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* SUB CITY DROPDOWN */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Sub Cities</label>
                <FormControl fullWidth size="small">
                  <Select
                    name="subCity"
                    multiple
                    value={formData.subCity}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput className="bg-gray-50 rounded-xl" />}
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
                    {subCities.map((sc) => (
                      <MenuItem key={sc._id} value={sc._id}>
                        <Checkbox checked={formData.subCity.indexOf(sc._id) > -1} size="small" color="primary" />
                        <ListItemText primary={`${sc.name} `} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="md:col-span-2">
                <Input label="HEADING" name="heading" value={formData.heading} onChange={handleChange} placeholder="Profile heading" required />
              </div>
              
              <div className="md:col-span-2">
                <Input label="PERMALINK" name="permalink" value={formData.permalink} onChange={handleChange} placeholder="auto-generated-slug" required />
              </div>
            </div>
          </Section>

          <hr className="border-gray-100" />

          {/* SECTION: CONTENT & BIO */}
          <Section title="Bio & Pricing" subtitle="Describe services and rates">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Textarea label="SHORT DESCRIPTION" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Brief intro..." />
                <Textarea label="PRICING DETAILS" name="priceDetails" value={formData.priceDetails} onChange={handleChange} rows={4} placeholder="Hourly/Nightly rates..." />
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
          <Section title="Media" subtitle="Upload visual content">
            <div className="grid md:grid-cols-2 gap-10">
              {/* MAIN IMAGE */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Main Featured Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-600 file:text-white cursor-pointer" />
                <div className="mt-4">
                  <Input label="IMAGE ALT TEXT" name="imageAlt" value={formData.imageAlt} onChange={handleChange} placeholder="SEO description for image" />
                </div>
                {previewImage && (
                  <div className="mt-4 w-32 h-40">
                    <img src={previewImage} className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white" alt="Preview" />
                  </div>
                )}
              </div>

              {/* GALLERY IMAGES */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Gallery Images</label>
                <input type="file" multiple accept="image/*" onChange={handleImagesChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-white cursor-pointer" />
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {previewGallery.map((img, i) => (
                    <div key={i} className="relative aspect-square">
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
              <Input label="SEO TITLE" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Meta title" />
              <Input label="SEO KEYWORDS" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} placeholder="keyword1, keyword2..." />
              <div className="md:col-span-2">
                <Textarea label="SEO DESCRIPTION" name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} placeholder="Meta description..." />
              </div>
            </div>
          </Section>

          {/* FOOTER & SUBMIT */}
          <div className="pt-8 border-t border-gray-100 flex justify-end items-center gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="showOnHomepage"
                id="showOnHomepage"
                checked={formData.showOnHomepage}
                onChange={handleChange}
                className="w-5 h-5 accent-pink-600 cursor-pointer"
              />
              <label htmlFor="showOnHomepage" className="text-sm font-medium text-gray-600 cursor-pointer">Pin to Homepage</label>
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

/* --- REUSABLE SUB-COMPONENTS --- */
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
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-gray-300 resize-none"
    />
  </div>
);

export default AddGirlForm;