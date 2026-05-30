"use client";

import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Link from "next/link";

import Image from "next/image";

import Drawer from "@mui/material/Drawer";

import { toast } from "react-toastify";

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

import {
  getCitiesThunk,
  deleteCityThunk,
  updateCityStatusThunk,
} from "@/store/slices/citySlice";

import {
  convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl";

/* =========================================
   SKELETON
========================================= */

const TableSkeleton = () => {

  return (
    <>
      {Array.from({
        length: 5,
      }).map((_, i) => (

        <tr
          key={i}
          className="animate-pulse border-b border-gray-100"
        >

          <td className="p-4">
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </td>

          <td className="p-4">
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-gray-200 rounded-xl" />

              <div className="space-y-2">

                <div className="h-4 w-28 bg-gray-200 rounded" />

                <div className="h-3 w-40 bg-gray-200 rounded" />

              </div>

            </div>
          </td>

          <td className="p-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </td>

          <td className="p-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </td>

          <td className="p-4">
            <div className="h-8 w-20 bg-gray-200 rounded-full" />
          </td>

          <td className="p-4">
            <div className="h-8 w-24 bg-gray-200 rounded-lg mx-auto" />
          </td>

        </tr>
      ))}
    </>
  );
};

/* =========================================
   MAIN
========================================= */

export default function AllCities() {

  const dispatch =
    useDispatch();

  const {
    cities = [],
    loading,
  } = useSelector(
    (state) =>
      state.city
  );

  const [open, setOpen] =
    useState(false);

  const [
    selectedCity,
    setSelectedCity,
  ] = useState(null);

  const [
    deleteId,
    setDeleteId,
  ] = useState(null);

  const [
    statusLoadingId,
    setStatusLoadingId,
  ] = useState(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const pageSize = 10;

  /* =========================================
     FETCH ONLY ONCE
  ========================================= */

  useEffect(() => {

    dispatch(
      getCitiesThunk()
    );

  }, [dispatch]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages =
    Math.ceil(
      cities.length /
      pageSize
    );

  const paginatedCities =
    useMemo(() => {

      const start =
        (currentPage - 1) *
        pageSize;

      return cities.slice(
        start,
        start + pageSize
      );

    }, [
      cities,
      currentPage,
    ]);

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this city?"
        )
      ) {
        return;
      }

      setDeleteId(id);

      try {

        const action =
          await dispatch(
            deleteCityThunk(
              id
            )
          );

        if (
          action.meta
            .requestStatus ===
          "fulfilled"
        ) {

          toast.success(
            "Deleted successfully"
          );
        }

      } catch (error) {

        toast.error(
          "Delete failed"
        );

      } finally {

        setDeleteId(null);
      }
    };

  /* =========================================
     STATUS
  ========================================= */

  const handleStatusToggle =
    async (city) => {

      setStatusLoadingId(
        city._id
      );

      try {

        const action =
          await dispatch(
            updateCityStatusThunk(
              {
                id: city._id,

                status:
                  city.status ===
                    "Active"
                    ? "Inactive"
                    : "Active",
              }
            )
          );

        if (
          action.meta
            .requestStatus ===
          "fulfilled"
        ) {

          toast.success(
            "Status updated"
          );
        }

      } catch (error) {

        toast.error(
          "Status failed"
        );

      } finally {

        setStatusLoadingId(
          null
        );
      }
    };

  /* =========================================
     VIEW
  ========================================= */

  const handleView = (
    city
  ) => {

    setSelectedCity(city);

    setOpen(true);
  };

  return (

    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* =========================================
           HEADER
        ========================================= */}

        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>

            <h2 className="text-3xl font-black text-gray-900">

              Cities Directory

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              Manage service locations
              and SEO content.

            </p>

          </div>

          <Link
            href="/admin/create-city"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all"
          >

            + Add New City

          </Link>

        </div>

        {/* =========================================
           TABLE
        ========================================= */}

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full table-fixed border-collapse">

              <thead>

                <tr className="bg-gray-50 text-xs uppercase text-gray-500">

                  <th className="px-6 py-5 w-16">
                    #
                  </th>

                  <th className="px-6 py-5 w-[320px] text-left">
                    City
                  </th>

                  <th className="px-6 py-5 w-[170px] text-left">
                    Contact
                  </th>

                  <th className="px-6 py-5 w-[150px] text-left">
                    Created
                  </th>

                  <th className="px-6 py-5 w-[120px] text-left">
                    Status
                  </th>

                  <th className="px-6 py-5 w-[150px] text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <TableSkeleton />

                ) : (

                  paginatedCities.map(
                    (
                      city,
                      index
                    ) => (

                      <tr
                        key={
                          city._id
                        }
                        className="border-b border-gray-100 hover:bg-blue-50/20"
                      >

                        {/* INDEX */}

                        <td className="px-6 py-4 text-xs text-gray-400">

                          {(currentPage - 1) * pageSize + index + 1}

                        </td>

                        {/* CITY */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="relative w-12 h-12 min-w-[48px] rounded-xl overflow-hidden bg-gray-100">

                              {city.imageUrl ? (

                                <Image
                                  src={
                                    city.imageUrl
                                      ? convertCloudinaryUrl(
                                        city.imageUrl
                                      )
                                      : "/placeholder.jpg"
                                  }
                                  alt={city.mainCity}
                                  width={48}
                                  height={48}
                                  quality={50}
                                  loading="lazy"
                                  unoptimized
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/placeholder.jpg";
                                  }}
                                  className="object-cover rounded-xl"
                                />

                              ) : (

                                <div className="w-full h-full flex items-center justify-center">

                                  <MapPinIcon className="w-5 h-5 text-blue-500" />

                                </div>

                              )}

                            </div>

                            <div className="min-w-0">

                              <h3 className="font-bold text-gray-900 truncate">

                                {
                                  city.mainCity
                                }

                              </h3>

                              <p className="text-xs text-gray-400 truncate">

                                {
                                  city.heading
                                }

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-4">

                          <div className="space-y-1 text-xs">

                            <div className="flex items-center gap-2">

                              <PhoneIcon className="w-3 h-3 text-blue-500" />

                              <span>

                                {city.phoneNumber ||
                                  "N/A"}

                              </span>

                            </div>

                            <div className="flex items-center gap-2">

                              <ChatBubbleLeftRightIcon className="w-3 h-3 text-green-500" />

                              <span>

                                {city.whatsappNumber ||
                                  "N/A"}

                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CREATED */}

                        <td className="px-6 py-4 text-sm text-gray-500">

                          {new Date(
                            city.createdAt
                          ).toLocaleDateString()}

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {statusLoadingId ===
                            city._id ? (

                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

                          ) : (

                            <button
                              onClick={() =>
                                handleStatusToggle(
                                  city
                                )
                              }
                              className={`px-3 py-1 rounded-full text-[10px] font-bold ${city.status ===
                                "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >

                              {
                                city.status
                              }

                            </button>

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex justify-center gap-2">

                            <button
                              onClick={() =>
                                handleView(
                                  city
                                )
                              }
                              className="p-2 rounded-xl hover:bg-blue-50"
                            >

                              <EyeIcon className="w-5 h-5 text-blue-600" />

                            </button>

                            <Link
                              href={`/admin/edit-city/${city._id}`}
                              className="p-2 rounded-xl hover:bg-blue-50"
                            >

                              <PencilSquareIcon className="w-5 h-5 text-blue-600" />

                            </Link>

                            <button
                              disabled={
                                deleteId ===
                                city._id
                              }
                              onClick={() =>
                                handleDelete(
                                  city._id
                                )
                              }
                              className="p-2 rounded-xl hover:bg-red-50"
                            >

                              <TrashIcon className="w-5 h-5 text-red-500" />

                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =========================================
             PAGINATION
          ========================================= */}

          {!loading &&
            cities.length > pageSize && (

              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">

                <p className="text-xs text-gray-500 font-medium">

                  Showing

                  <span className="text-blue-600 font-bold px-1">

                    {paginatedCities.length}

                  </span>

                  of

                  <span className="text-blue-600 font-bold px-1">

                    {cities.length}

                  </span>

                  cities

                </p>

                <div className="flex items-center gap-2 flex-wrap justify-center">

                  {/* PREV */}

                  <button
                    onClick={() =>
                      setCurrentPage(
                        (prev) =>
                          Math.max(
                            prev - 1,
                            1
                          )
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >

                    Prev

                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, i) =>
                      i + 1
                  ).map((page) => (

                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage ===
                        page
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >

                      {page}

                    </button>

                  ))}

                  {/* NEXT */}

                  <button
                    onClick={() =>
                      setCurrentPage(
                        (prev) =>
                          Math.min(
                            prev + 1,
                            totalPages
                          )
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >

                    Next

                  </button>

                </div>

              </div>

            )}

        </div>

        {/* =========================================
           DRAWER
        ========================================= */}

        <Drawer
          anchor="right"
          open={open}
          onClose={() =>
            setOpen(false)
          }
        >

          <div className="w-[100vw] sm:w-[450px] h-full bg-white">

            {selectedCity && (

              <div className="p-6">

                <div className="relative h-56 rounded-2xl overflow-hidden">

                  <Image
                    src={convertCloudinaryUrl(
                      selectedCity.imageUrl
                    )}
                    alt={
                      selectedCity.mainCity
                    }
                    fill
                    quality={70}
                    className="object-cover"
                  />

                </div>

              </div>

            )}

          </div>

        </Drawer>

      </div>

    </div>
  );
}