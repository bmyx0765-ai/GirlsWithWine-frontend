"use client";

/* ================= IMPORTS ================= */
import React, {
  useMemo,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FiMapPin,
} from "react-icons/fi";

import CommonFaq from "@/components/CommonFaq";
import CityMetaSection from "@/components/CityMetaSection";

import {
  getGirlsBySubCityThunk,
} from "@/store/slices/girlSlice";

/* ================= HELPERS ================= */

const cleanHTML = (
  html = ""
) =>
  html
    .replace(
      /<html.*?>/gi,
      ""
    )
    .replace(
      /<\/html>/gi,
      ""
    )
    .replace(
      /<body.*?>/gi,
      ""
    )
    .replace(
      /<\/body>/gi,
      ""
    );

const cleanNumber = (
  num
) => num?.replace(/\D/g, "");

const formatPhone = (
  num
) => {

  if (!num) return "";

  const cleaned =
    cleanNumber(num);

  return cleaned.startsWith(
    "91"
  )
    ? `+${cleaned}`
    : `+91${cleaned}`;
};

const createWhatsAppURL = (
  name,
  number
) => {

  const msg =
    encodeURIComponent(
      `Hi ${name}, I saw your profile and want to connect.`
    );

  return `https://wa.me/${cleanNumber(number)}?text=${msg}`;
};

/* ================= COMPONENT ================= */

const SubCityGirlsPage = ({
  data,
}) => {

  const router =
    useRouter();

  const dispatch =
    useDispatch();

  /* ================= REDUX ================= */

  const {
    cityGirls = [],
    cityLoading = false,
  } = useSelector(
    (state) =>
      state.girls || {}
  );

  /* ================= NO DATA ================= */

  if (!data) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-white">

        <h2 className="text-3xl font-bold text-gray-900">
          No Data Found
        </h2>

      </div>

    );
  }

  /* ================= DESTRUCTURING ================= */

  const {
    _id,
    heading,
    name,
    description,
    girls: initialGirls = [],
    city,
    tags = [],
    subCities = [],
    updatedAt,
  } = data;

  const finalName =
    name ||
    "Premium Area";

  const cityHeading =
    heading ||
    `${finalName} Call Girls`;

  /* ================= FETCH GIRLS ================= */

  useEffect(() => {

    if (_id) {

      dispatch(
        getGirlsBySubCityThunk(
          _id
        )
      );

    }

  }, [_id, dispatch]);

  /* ================= FINAL GIRLS ================= */

  const finalGirls =
    cityGirls?.length
      ? cityGirls
      : initialGirls;

  /* ================= DATE ================= */

  const formattedDate =
    useMemo(() => {

      if (!updatedAt)
        return "";

      return new Date(
        updatedAt
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

    }, [updatedAt]);

  return (
    <>

      {/* ================================================= */}
      {/* ================= MAIN CONTENT ================== */}
      {/* ================================================= */}

      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20 mt-10">

        {/* ================= HEADING ================= */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-[#B30059] px-4 py-2 rounded-full text-sm font-semibold mb-5">

            <FiMapPin />

            {city?.mainCity ||
              finalName}

          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">

            {cityHeading}

          </h1>

          {formattedDate && (

            <p className="text-xs text-gray-400 mt-3">

              Last Updated:{" "}
              {formattedDate}

            </p>

          )}

        </div>

        {/* ================= GIRLS LIST ================= */}

        <div className="space-y-6">

          {/* ================= LOADING ================= */}

          {cityLoading ? (

            <div className="bg-white border rounded-2xl py-14 text-center">

              <p className="text-gray-400 text-lg">
                Loading profiles...
              </p>

            </div>

          ) : !finalGirls?.length ? (

            /* ================= EMPTY ================= */

            <p className="text-center text-gray-400 py-10 border rounded-2xl bg-white">

              No results found in{" "}
              {finalName}

            </p>

          ) : (

            /* ================= GIRLS ================= */

            finalGirls.map(
              (girl) => {

                const wp =
                  formatPhone(
                    girl?.whatsappNumber ||
                      city?.whatsappNumber
                  );

                const call =
                  formatPhone(
                    girl?.phoneNumber ||
                      city?.phoneNumber
                  );

                return (

                  <div
                    key={
                      girl?._id
                    }

                    onClick={() =>
                      router.push(
                        `/${girl?.permalink}`
                      )
                    }

                    className="
                      cursor-pointer
                      bg-white
                      rounded-2xl
                      p-4
                      shadow-sm
                      hover:shadow-lg
                      transition
                      border
                      flex
                      flex-col
                      sm:flex-row
                      gap-4
                    "
                  >

                    {/* IMAGE */}

                    <div className="w-full sm:w-40 h-52 sm:h-40 rounded-xl overflow-hidden bg-gray-100 shrink-0">

                      <img
                        src={
                          girl?.imageUrl ||
                          girl
                            ?.imageUrls?.[0] ||
                          "/placeholder.jpg"
                        }

                        alt={
                          girl?.imageAlt ||
                          girl?.name ||
                          "Profile"
                        }

                        className="w-full h-full object-cover"
                      />

                    </div>

                    {/* CONTENT */}

                    <div className="flex-1 flex flex-col justify-between">

                      <div>

                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">

                          {girl?.heading ||
                            girl?.name}

                        </h3>

                        <div
                          className="
                            text-sm
                            text-gray-600
                            mt-2
                            line-clamp-2
                          "
                          dangerouslySetInnerHTML={{
                            __html:
                              cleanHTML(
                                girl?.description ||
                                  girl?.subHeading
                              ),
                          }}
                        />

                        <div className="flex flex-wrap gap-3 text-[15px] mt-3 font-semibold text-[#B30059]">

                          {girl?.age && (
                            <span>
                              {
                                girl.age
                              }{" "}
                              Years
                            </span>
                          )}

                          <span>|</span>

                          <span>
                            Call Girls
                          </span>

                          <span>|</span>

                          <span>
                            {
                              finalName
                            }
                          </span>

                        </div>

                      </div>

                      {/* BUTTONS */}

                      <div className="flex gap-3 mt-4 justify-end flex-wrap">

                        {wp && (

                          <a
                            onClick={(
                              e
                            ) =>
                              e.stopPropagation()
                            }

                            href={createWhatsAppURL(
                              girl?.name,
                              wp
                            )}

                            target="_blank"

                            rel="noreferrer"

                            className="
                              px-4
                              py-2
                              bg-[#25D366]
                              text-white
                              text-sm
                              rounded-lg
                              font-medium
                              hover:opacity-90
                              whitespace-nowrap
                            "
                          >

                            WhatsApp

                          </a>

                        )}

                        {call && (

                          <a
                            onClick={(
                              e
                            ) =>
                              e.stopPropagation()
                            }

                            href={`tel:${cleanNumber(call)}`}

                            className="
                              px-4
                              py-2
                              bg-[#B30059]
                              text-white
                              text-sm
                              rounded-lg
                              font-medium
                              hover:opacity-90
                              whitespace-nowrap
                            "
                          >

                            Call

                          </a>

                        )}

                      </div>

                    </div>

                  </div>

                );
              }
            )
          )}

        </div>

        {/* ================= DESCRIPTION ================= */}

        {description && (

          <div className="mt-16 p-6 bg-white rounded-2xl shadow-sm ">

            <div
              className="
                prose
                prose-slate
                max-w-none
                prose-p:text-gray-600
              "
              dangerouslySetInnerHTML={{
                __html:
                  cleanHTML(
                    description
                  ),
              }}
            />

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* ================= FAQ SECTION =================== */}
      {/* ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">

        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-sm border border-gray-100">

          <CommonFaq
            type="subcity"
            subCityId={_id}
            title={`FAQs – ${finalName} Call Girls & VIP Escorts`}
            subTitle={`Find answers to the most common questions related to services in ${finalName}.`}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* ================= META SECTION ================== */}
      {/* ================================================= */}

      <CityMetaSection
        subCities={
          subCities || []
        }
        tags={tags || []}
      />

    </>
  );
};

export default SubCityGirlsPage;