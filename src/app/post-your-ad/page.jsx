"use client";

import { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    message: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...formData,
      image,
    });

    alert("Form Submitted Successfully");
  };

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-3xl mx-auto px-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name*"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full h-16 border border-gray-300 px-5 text-lg outline-none focus:border-[#5a5d46]"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email*"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full h-16 border border-gray-300 px-5 text-lg outline-none focus:border-[#5a5d46]"
          />

          {/* Mobile */}
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile*"
            required
            value={formData.mobile}
            onChange={handleChange}
            className="w-full h-16 border border-gray-300 px-5 text-lg outline-none focus:border-[#5a5d46]"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location*"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full h-16 border border-gray-300 px-5 text-lg outline-none focus:border-[#5a5d46]"
          />

          {/* Message */}
          <textarea
            name="message"
            placeholder="Message*"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 px-5 py-4 text-lg outline-none resize-none focus:border-[#5a5d46]"
          ></textarea>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="block w-full border border-gray-300 p-3 cursor-pointer"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-5 w-40 h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#595c45] hover:bg-[#444633] text-white uppercase tracking-[4px] px-12 py-5 rounded-full text-lg font-semibold transition-all duration-300"
            >
              Submit Details
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;