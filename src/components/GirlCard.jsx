"use client";

import {
  memo,
  useMemo,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { convertCloudinaryUrl } from "@/utils/convertCloudinaryUrl";

/* ================= CONSTANTS ================= */

const PLACEHOLDER = "/placeholder.jpg";
const IMAGE_SIZES =
  "(max-width:640px) 100vw, (max-width:1024px) 40vw, 160px";

/* ================= HELPERS ================= */

const cleanHTML = (html = "") =>
  html
    .replace(/<html.*?>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<body.*?>/gi, "")
    .replace(/<\/body>/gi, "");

const cleanNumber = (number = "") =>
  String(number).replace(/\D/g, "");

const formatPhone = (number = "") => {
  const cleaned = cleanNumber(number);

  if (!cleaned) return "";

  return cleaned.startsWith("91")
    ? `+${cleaned}`
    : `+91${cleaned}`;
};

const createWhatsAppURL = (
  name = "",
  number = ""
) => {
  const cleaned = cleanNumber(number);

  if (!cleaned) return "#";

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(
    `Hi ${name}, I saw your profile and want to connect.`
  )}`;
};

/* ===================================================== */

function GirlCard({
   girl,
  cityObj,
  finalName,
  loading = false,
}) {

  /* ================= IMAGE ================= */

  const [imageError, setImageError] =
    useState(false);

  const imageUrl = useMemo(() => {
    if (!girl?.imageUrl) {
      return PLACEHOLDER;
    }

    return convertCloudinaryUrl(
      girl.imageUrl
    );
  }, [girl?.imageUrl]);

  /* ================= DESCRIPTION ================= */

  const description =
    useMemo(
      () => ({
        __html: cleanHTML(
          girl?.description || ""
        ),
      }),
      [girl?.description]
    );

  /* ================= PHONE ================= */

  const whatsapp =
    useMemo(
      () =>
        formatPhone(
          girl?.whatsappNumber ||
            cityObj?.whatsappNumber
        ),
      [
        girl?.whatsappNumber,
        cityObj?.whatsappNumber,
      ]
    );

  const call =
    useMemo(
      () =>
        formatPhone(
          girl?.phoneNumber ||
            cityObj?.phoneNumber
        ),
      [
        girl?.phoneNumber,
        cityObj?.phoneNumber,
      ]
    );

  /* ================= URL ================= */

  const whatsappUrl =
    useMemo(
      () =>
        createWhatsAppURL(
          girl?.name,
          whatsapp
        ),
      [
        girl?.name,
        whatsapp,
      ]
    );

  /* ================= IMAGE ERROR ================= */

  const handleImageError =
    useCallback(() => {
      setImageError(true);
    }, []);


    if (loading) {
  return <GirlCardSkeleton />;
}

  return (
    <Link
      href={`/call-girls/${girl.permalink}`}
      prefetch={false}
      className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-lg sm:flex-row"
    >
      {/* IMAGE */}

      <div className="relative h-52 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-40 sm:w-40">

        {imageError ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={
              girl?.imageAlt ||
              girl?.heading ||
              girl?.name ||
              "Girl Image"
            }
            fill
            loading="lazy"
            sizes={IMAGE_SIZES}
            className="object-cover"
            onError={handleImageError}
          />
        )}

      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col justify-between">

        <div>

          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            {girl.heading}
          </h3>

          <div
            className="mt-2 line-clamp-2 text-sm text-gray-600"
            dangerouslySetInnerHTML={
              description
            }
          />

          <div className="mt-3 flex flex-wrap gap-3 text-[15px] font-semibold text-[#B30059]">

            {girl.age && (
              <span>
                {girl.age} Years
              </span>
            )}

            <span>|</span>

            <span>
              Call Girls
            </span>

            <span>|</span>

            <span>
              {finalName}
            </span>

          </div>

        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-3">

          {whatsapp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) =>
                e.stopPropagation()
              }
              className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              WhatsApp
            </a>
          )}

          {call && (
            <a
              href={`tel:${cleanNumber(
                call
              )}`}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="rounded-lg bg-[#B30059] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Call
            </a>
          )}

        </div>

      </div>
    </Link>
  );
}

/* ================= SKELETON ================= */

const GirlCardSkeleton = memo(() => (
  <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm animate-pulse sm:flex-row">

    <div className="h-52 w-full rounded-xl bg-gray-200 sm:h-40 sm:w-40" />

    <div className="flex flex-1 flex-col justify-between">

      <div>

        <div className="h-6 w-3/4 rounded bg-gray-200" />

        <div className="mt-3 h-4 w-full rounded bg-gray-100" />
        <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />

        <div className="mt-4 flex gap-3">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>

      </div>

      <div className="mt-5 flex justify-end gap-3">

        <div className="h-10 w-28 rounded-lg bg-gray-200" />

        <div className="h-10 w-24 rounded-lg bg-gray-200" />

      </div>

    </div>

  </div>
));

GirlCardSkeleton.displayName =
  "GirlCardSkeleton";

export default memo(GirlCard);