export const convertCloudinaryUrl = (url) => {

  // ❌ invalid url
  if (
    !url ||
    typeof url !== "string" ||
    url.trim() === ""
  ) {
    return "";
  }

  // ✅ Cloudinary URL → Custom Domain
  if (
    url.includes(
      "res.cloudinary.com"
    )
  ) {

    return url.replace(
      "https://res.cloudinary.com/dd8zulgom/image/upload",
      "https://girlswithwine.com/uploads"
    );
  }

  // ✅ already valid
  return url;
};