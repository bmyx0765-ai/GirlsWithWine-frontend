export const getSlugFromCanonical = (url) => {
  if (!url) return "";
  return url.split(".com/")[1];
};