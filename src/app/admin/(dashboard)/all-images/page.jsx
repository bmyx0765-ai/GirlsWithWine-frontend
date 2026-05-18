"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl.js";

const API =
  process.env
    .NEXT_PUBLIC_BASE_URL;

export default function AllImages() {

  const [images, setImages] =
    useState([]);

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [file, setFile] =
    useState(null);

  const [
    preview,
    setPreview,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* ===========================
     FETCH IMAGES
  =========================== */

  const fetchImages =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/api/upload`
          );

        setImages(
          res.data.images ||
          []
        );

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

  const handleChange = (
    e
  ) => {

    const selected =
      e.target.files[0];

    if (!selected)
      return;

    setFile(selected);

    setPreview(
      URL.createObjectURL(
        selected
      )
    );
  };

  /* ===========================
     UPLOAD IMAGE
  =========================== */

  const handleUpload =
    async () => {

      if (!file) {

        return alert(
          "Select image"
        );
      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        await axios.post(
          `${API}/api/upload/static/blog`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Uploaded ✅"
        );

        setShowModal(
          false
        );

        setFile(null);

        setPreview("");

        fetchImages();

      } catch (err) {

        console.log(err);

        alert(
          "Upload failed ❌"
        );

      } finally {

        setLoading(false);
      }
    };

  /* ===========================
     IMAGE URL
  =========================== */

  const getImageUrl = (
    url
  ) => {

    if (
      !url ||
      typeof url !==
        "string"
    ) {

      return "/placeholder.jpg";
    }

    return convertCloudinaryUrl(
      url
    );
  };

  return (

    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">

            All Images

          </h1>

          <p className="text-sm text-gray-500 mt-1">

            Manage uploaded
            Cloudinary images

          </p>

        </div>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }
          className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-pink-100 transition-all"
        >

          + Add Image

        </button>

      </div>

      {/* ================= IMAGE GRID ================= */}

      {images?.length ===
      0 ? (

        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-20 text-center">

          <p className="text-gray-400">

            No images found

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">

          {images.map(
            (img) => (

              <div
                key={
                  img._id
                }
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >

                <img
                  src={getImageUrl(
                    img.url
                  )}
                  alt="Uploaded"
                  className="w-full h-52 object-cover"
                  onError={(
                    e
                  ) => {

                    e.currentTarget.src =
                      "/placeholder.jpg";
                  }}
                />

                <div className="p-3 border-t border-gray-50">

                  <p className="text-xs text-gray-400 truncate">

                    {
                      img._id
                    }

                  </p>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* ================= MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">

            <h2 className="text-xl font-bold text-gray-900 mb-5">

              Upload Image

            </h2>

            {/* FILE INPUT */}

            <input
              type="file"
              accept="image/*"
              onChange={
                handleChange
              }
              className="w-full border border-gray-200 rounded-xl p-3 text-sm"
            />

            {/* PREVIEW */}

            {preview && (

              <div className="mt-5">

                <img
                  src={
                    preview
                  }
                  alt="Preview"
                  className="w-full h-52 object-cover rounded-2xl border border-gray-100"
                />

              </div>
            )}

            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => {

                  setShowModal(
                    false
                  );

                  setFile(
                    null
                  );

                  setPreview(
                    ""
                  );
                }}
                className="flex-1 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-medium transition-all"
              >

                Cancel

              </button>

              <button
                onClick={
                  handleUpload
                }
                disabled={
                  loading
                }
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all"
              >

                {loading
                  ? "Uploading..."
                  : "Upload"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}