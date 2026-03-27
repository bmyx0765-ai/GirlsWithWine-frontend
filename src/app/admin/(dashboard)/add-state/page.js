"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  createStateThunk,
  clearStateMessage,
} from "@/store/slices/stateSlice";

export default function AddStateForm() {

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, message } = useSelector((state) => state.states);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (e) => {

    e.preventDefault();

    dispatch(createStateThunk({ name, status })).then((res) => {

      if (res.meta.requestStatus === "fulfilled") {

        setName("");
        setStatus("Active");

        router.push("/admin/all-state");

      }

    });

  };

  /* Auto clear message */

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        dispatch(clearStateMessage());
      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [message, dispatch]);


  return (

    <div className="bg-white shadow-md rounded-lg p-6">

      {/* Back Button */}

      <button
        onClick={() => router.push("/admin/all-state")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
      >
        ← Back
      </button>


      <h2 className="text-xl font-semibold mb-4">
        Add New State
      </h2>


      {message && (

        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>

      )}


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end"
      >

        {/* State Name */}

        <div>

          <label className="block font-medium mb-1">
            State Name *
          </label>

          <input
            type="text"
            placeholder="Enter state name"
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

        </div>


        {/* Status */}

        <div>

          <label className="block font-medium mb-1">
            Status
          </label>

          <select
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >

            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>

          </select>

        </div>


        {/* Submit */}

        <div className="flex justify-start sm:justify-end">

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >

            {loading ? "Saving..." : "Create State"}

          </button>

        </div>

      </form>

    </div>

  );
}