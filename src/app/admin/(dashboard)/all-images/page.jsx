"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_BASE_URL;

export default function AllImages() {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===========================
     FETCH IMAGES
  =========================== */
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API}/api/upload`);
      setImages(res.data.images);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ===========================
     FILE CHANGE
  =========================== */
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* ===========================
     UPLOAD IMAGE
  =========================== */
  const handleUpload = async () => {
    if (!file) return alert("Select image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      await axios.post(`${API}/api/upload/static/blog`, formData);

      alert("Uploaded ✅");

      setShowModal(false);
      setFile(null);
      setPreview("");

      fetchImages(); // refresh
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Images</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          + Add Image
        </button>
      </div>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="border p-2 rounded">
            <img
              src={img.url}
              className="w-full h-40 object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-lg font-bold mb-4">Upload Image</h2>

            {/* FILE INPUT */}
            <input type="file" onChange={handleChange} />

            {/* PREVIEW */}
            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover mt-3 rounded"
              />
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 mt-5">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 bg-pink-600 text-white py-2 rounded"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}