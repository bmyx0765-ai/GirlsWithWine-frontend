"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import RichTextEditor from "@/components/RichTextEditor";
import {
  ArrowLeftIcon,
  PhotoIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";

import { createBlogThunk } from "@/store/slices/blogSlice";

const AddBlogPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { addLoading } = useSelector((state) => state.blog || {});

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    imageAlt: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a cover image");
      return;
    }

    const fd = new FormData();

    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("seoTitle", formData.seoTitle);
    fd.append("seoDescription", formData.seoDescription);
    fd.append("seoKeywords", formData.seoKeywords);
    fd.append("imageAlt", formData.imageAlt);

    // ✅ IMPORTANT FIX
    fd.append("image", imageFile);

    // 🔍 DEBUG (optional)
    // for (let pair of fd.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    const res = await dispatch(createBlogThunk(fd));

    if (!res.error) {
      toast.success("Blog published successfully!");
      router.push("/admin/all-blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Blog</h1>
            <p className="text-sm text-gray-500">
              Write and publish your article
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
        >

          {/* ================= CONTENT ================= */}
          <div className="p-6 space-y-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Blog Content
            </h2>

            <Input
              label="Blog Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
            />

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Description
              </label>
              <div className="border rounded-xl overflow-hidden">
                <RichTextEditor
                  value={formData.description}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: val,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* ================= IMAGE ================= */}
          <div className="p-6 space-y-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Featured Image
            </h2>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 transition">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">
                    Click to upload image
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                <div className="mt-4">
                  <Input
                    label="Image Alt Text"
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={handleChange}
                    placeholder="Describe the image"
                  />
                </div>
              </div>

              {/* PREVIEW */}
              <div className="h-40 rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    No image selected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ================= SEO ================= */}
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              SEO Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="SEO Title"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Enter SEO title"
              />

              <Input
                label="SEO Keywords"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                placeholder="comma separated keywords"
              />

              <div className="md:col-span-2">
                <Textarea
                  label="SEO Description"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short SEO description"
                />
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex justify-end p-6 border-t bg-gray-50">
            <button
              type="submit"
              disabled={addLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {addLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <DocumentPlusIcon className="w-4 h-4" />
              )}
              {addLoading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 focus:bg-white transition"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 focus:bg-white transition"
    />
  </div>
);

export default AddBlogPage;