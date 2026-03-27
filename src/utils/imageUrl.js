export const getImageUrl = (url) => {
  if (!url) return "";

  // agar already frontend domain hai
  if (url.includes("girlswithwine.com")) return url;

  // backend → frontend replace
  return url.replace(
    "https://api4.girlswithwine.in",
    "https://girlswithwine.com"
  );
};
