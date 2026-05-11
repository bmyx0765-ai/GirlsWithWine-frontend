// ================= ADMIN =================
export const LOGIN_ADMIN_URL = "/api/admin/login";



// ================= CITY =================

// CREATE
export const ADD_CITY_URL = "/api/cities/create";

// GET ALL
export const GET_CITIES_URL = "/api/cities";

// DELETE
export const DELETE_CITY_URL = "/api/cities/delete";

// STATUS UPDATE
export const CITY_STATUS_URL = "/api/cities/status";

// UPDATE NAME / FULL UPDATE
export const UPDATE_CITY_URL = "/api/cities/update";

// UPDATE IMAGE
export const UPDATE_CITY_IMAGE_URL = "/api/cities/image";

// GET BY ID (ADMIN)
export const GET_CITY_BY_ID_URL = "/api/cities/admin";

// CITY PAGE (SEO / PUBLIC via slug)
export const GET_CITY_PAGE_URL = "/api/cities";







// ================= GIRL APIs =================

// CREATE
export const ADD_GIRL_URL = "/api/girls/add";

// READ
export const GET_ALL_GIRLS_URL = "/api/girls/all";

// BY CITY
export const GET_GIRLS_BY_CITY_URL = "/api/girls/city";

// BY SUBCITY (🔥 NEW)
export const GET_GIRLS_BY_SUBCITY_URL = "/api/girls/subcity";

// BY ID (ADMIN / FALLBACK)
export const GET_SINGLE_GIRL_URL = "/api/girls/details";

// 🔥 MAIN SEO API
export const GET_GIRL_BY_SLUG_URL = "/api/girls";

// UPDATE
export const UPDATE_GIRL_URL = "/api/girls/update";

// DELETE
export const DELETE_GIRL_URL = "/api/girls/delete";

// STATUS
export const TOGGLE_GIRL_STATUS_URL = "/api/girls/status";















// ================= STATE =================
export const ADD_STATE_URL = "/api/states/create";
export const GET_STATES_URL = "/api/states/list";
export const GET_STATE_BY_ID_URL = "/api/states";
export const UPDATE_STATE_URL = "/api/states/update";
export const DELETE_STATE_URL = "/api/states/delete";
export const TOGGLE_STATE_STATUS_URL = "/api/states/status";


// ================= CONTACT =================
export const CREATE_CONTACT_URL = "/api/contact/create";
export const GET_ALL_CONTACTS_URL = "/api/contact/all";
export const GET_CONTACT_BY_ID_URL = "/api/contact";
export const DELETE_CONTACT_URL = "/api/contact/delete";
export const TOGGLE_CONTACT_STATUS_URL = "/api/contact/status";

// ================= Review =================

// CREATE
export const CREATE_REVIEW_URL = "/api/reviews/add";

// GET
export const GET_ALL_REVIEWS_URL = "/api/reviews";
export const GET_TOP_REVIEWS_URL = "/api/reviews/top";
export const GET_REVIEW_BY_GIRL_ID = "/api/reviews/girl/:id";

// UPDATE (APPROVE / REJECT)
export const APPROVE_REVIEW_URL = "/api/reviews/approve/:id";
export const REJECT_REVIEW_URL = "/api/reviews/reject/:id";

// DELETE
export const DELETE_REVIEW_URL = "/api/reviews/:id";

// ================= BLOG =================

// CREATE
export const CREATE_BLOG_URL = "/api/blogs/add";

// GET
export const GET_ALL_BLOGS_URL = "/api/blogs/list";
export const GET_BLOG_BY_SLUG_URL = "/api/blogs/:slug";

// UPDATE
export const UPDATE_BLOG_URL = "/api/blogs/update/:id";

// DELETE
export const DELETE_BLOG_URL = "/api/blogs/delete/:id";

// ================= SUB-CITY =================

// CREATE
export const ADD_SUBCITY_URL = "/api/subcities/create";

// GET ALL
export const GET_SUBCITIES_URL = "/api/subcities";

// GET BY CITY
export const GET_SUBCITIES_BY_CITY_URL = "/api/subcities/city";

// GET BY ID (ADMIN)
export const GET_SUBCITY_BY_ID_URL = "/api/subcities/admin";

// UPDATE
export const UPDATE_SUBCITY_URL = "/api/subcities/update";

// DELETE
export const DELETE_SUBCITY_URL = "/api/subcities/delete";

// STATUS
export const SUBCITY_STATUS_URL = "/api/subcities/status";

// SEO PAGE
export const GET_SUBCITY_PAGE_URL = "/api/subcities";






// ================= FAQ =================

/* =========================================================
   CREATE FAQ
========================================================= */

export const ADD_FAQ_URL =
  "/api/faqs/add";

/* =========================================================
   GET ALL FAQ
========================================================= */

export const GET_FAQS_URL =
  "/api/faqs";

/* =========================================================
   GET HOMEPAGE FAQ
========================================================= */

export const GET_HOMEPAGE_FAQS_URL =
  "/api/faqs/homepage";

/* =========================================================
   GET FAQ BY TYPE
   usage:
   `${GET_FAQS_BY_TYPE_URL}/homepage`
========================================================= */

export const GET_FAQS_BY_TYPE_URL =
  "/api/faqs/type";

/* =========================================================
   GET FAQ BY CITY
   usage:
   `${GET_FAQS_BY_CITY_URL}/${cityId}`
========================================================= */

export const GET_FAQS_BY_CITY_URL =
  "/api/faqs/city";

/* =========================================================
   GET FAQ BY SUBCITY
   usage:
   `${GET_FAQS_BY_SUBCITY_URL}/${subCityId}`
========================================================= */

export const GET_FAQS_BY_SUBCITY_URL =
  "/api/faqs/subcity";

/* =========================================================
   GET FAQ BY GIRL
   usage:
   `${GET_FAQS_BY_GIRL_URL}/${girlId}`
========================================================= */

export const GET_FAQS_BY_GIRL_URL =
  "/api/faqs/girl";

/* =========================================================
   UPDATE FAQ
   usage:
   `${UPDATE_FAQ_URL}/${faqId}`
========================================================= */

export const UPDATE_FAQ_URL =
  "/api/faqs/update";

/* =========================================================
   DELETE FAQ
   usage:
   `${DELETE_FAQ_URL}/${faqId}`
========================================================= */

export const DELETE_FAQ_URL =
  "/api/faqs/delete";

/* =========================================================
   TOGGLE FAQ STATUS
   usage:
   `${TOGGLE_FAQ_STATUS_URL}/${faqId}`
========================================================= */

export const TOGGLE_FAQ_STATUS_URL =
  "/api/faqs/status";