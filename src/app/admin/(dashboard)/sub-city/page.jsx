"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  fetchSubCities,
  deleteSubCity,
  toggleSubCityStatus
} from "@/store/slices/subCitySlice";

import Drawer from "@mui/material/Drawer";
import { toast } from "react-toastify";

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";


// ---------------- Skeleton ----------------
const TableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b">
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        </tr>
      ))}
    </>
  );
};


export default function AllSubCities() {

  const dispatch = useDispatch();

  const { subCities = [], loading } = useSelector((s) => s.subCity);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = subCities.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginated = subCities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    dispatch(fetchSubCities());
  }, [dispatch]);


  // delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this subcity?")) return;

    setDeleteId(id);
    const res = await dispatch(deleteSubCity(id));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Deleted");
      dispatch(fetchSubCities());
    }

    setDeleteId(null);
  };


  // status
  const handleStatus = async (item) => {
    setStatusLoadingId(item._id);

    const res = await dispatch(toggleSubCityStatus(item._id));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Status updated");
      dispatch(fetchSubCities());
    }

    setStatusLoadingId(null);
  };


  // view
  const handleView = (item) => {
    setSelected(item);
    setOpen(true);
  };


  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-3xl shadow flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">SubCity Directory</h2>
            <p className="text-gray-500 text-sm">
              Manage all sub locations
            </p>
          </div>

          <Link
            href="/admin/create-subcity"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            + Add SubCity
          </Link>
        </div>


        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-4">#</th>
                <th>Name</th>
                <th>City</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6">
                    No data
                  </td>
                </tr>
              ) : (
                paginated.map((item, i) => (
                  <tr key={item._id} className="border-t">

                    <td className="p-4">
                      {(currentPage - 1) * pageSize + (i + 1)}
                    </td>

                    <td className="p-4 font-semibold capitalize">
                      {item.name}
                    </td>

                    <td className="p-4 capitalize">
                      {item.city?.mainCity || "-"}
                    </td>

                    <td className="p-4 text-xs text-gray-500">
                      {item.slug}
                    </td>

                    <td className="p-4">
                      {statusLoadingId === item._id ? (
                        <div className="loader"></div>
                      ) : (
                        <button
                          onClick={() => handleStatus(item)}
                          className={`px-3 py-1 rounded text-xs ${
                            item.status === "Active"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.status}
                        </button>
                      )}
                    </td>

                    <td className="p-4 flex gap-2">

                      <button onClick={() => handleView(item)}>
                        <EyeIcon className="w-5" />
                      </button>

                      <Link href={`/admin/edit-subcity/${item._id}`}>
                        <PencilSquareIcon className="w-5" />
                      </Link>

                      <button onClick={() => handleDelete(item._id)}>
                        <TrashIcon className="w-5 text-red-500" />
                      </button>

                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>


        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">

            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>

          </div>
        )}


        {/* DRAWER */}
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>

          <div className="w-[400px] p-6">

            {selected && (
              <>
                <h2 className="text-xl font-bold mb-4">
                  {selected.name}
                </h2>

                <p><b>City:</b> {selected.city?.mainCity}</p>
                <p><b>Slug:</b> {selected.slug}</p>
                <p><b>Status:</b> {selected.status}</p>

                <div
                  dangerouslySetInnerHTML={{
                    __html: selected.description || ""
                  }}
                />
              </>
            )}

          </div>

        </Drawer>

      </div>

    </div>
  );
}