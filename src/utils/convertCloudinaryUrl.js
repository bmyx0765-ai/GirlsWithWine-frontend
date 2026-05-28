export const convertCloudinaryUrl = (
  url
) => {

  if (!url) {
    return "/placeholder.jpg";
  }

  // Cloudinary URL → Custom Domain

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

  return url;
};