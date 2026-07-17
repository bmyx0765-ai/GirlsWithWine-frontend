// store/slices/faqSlice.js

import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { axiosInstance } from "api/axiosInstance";

import {
  ADD_FAQ_URL,
  GET_FAQS_URL,
  GET_HOMEPAGE_FAQS_URL,
  GET_FAQS_BY_TYPE_URL,
  GET_FAQS_BY_CITY_URL,
  GET_FAQS_BY_SUBCITY_URL,
  GET_FAQS_BY_GIRL_URL,
  UPDATE_FAQ_URL,
  DELETE_FAQ_URL,
  TOGGLE_FAQ_STATUS_URL,
  GET_FAQS_BY_VISIBILITY_URL,
} from "api/constant/constant";

/* =========================================================
   NORMALIZE RESPONSE
========================================================= */

const normalizeFaqResponse = (data) => {

  // DIRECT ARRAY
  if (Array.isArray(data)) {
    return data;
  }

  // OBJECT WITH FAQS
  if (Array.isArray(data?.faqs)) {
    return data.faqs;
  }

  return [];
};

/* =========================================================
   COMMON HELPERS
========================================================= */

const getErrorMessage = (
  error,
  fallback
) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const updateFaqInList = (
  faqs,
  updatedFaq
) => {
  if (!updatedFaq?._id) return faqs;

  return faqs.map((faq) =>
    faq._id === updatedFaq._id
      ? updatedFaq
      : faq
  );
};

const removeFaqFromList = (
  faqs,
  faqId
) =>
  faqs.filter(
    (faq) => faq._id !== faqId
  );

/* =========================================================
   GET ALL FAQ
========================================================= */

export const getFaqsThunk = createAsyncThunk(
  "faq/getAll",

  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        GET_FAQS_URL
      );

      return normalizeFaqResponse(data);

    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch FAQs"
        )
      );
    }
  }
);

/* =========================================================
   GET HOMEPAGE FAQ
========================================================= */
export const getHomepageFaqsThunk =
  createAsyncThunk(
    "faq/getHomepage",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.get(
            GET_HOMEPAGE_FAQS_URL
          );

        return normalizeFaqResponse(
          data
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch homepage FAQs"
          )
        );

      }
    }
  );
/* =========================================================
   GET FAQ BY TYPE
========================================================= */

export const getFaqsByTypeThunk = createAsyncThunk(
  "faq/getByType",

  async (type, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(
        `${GET_FAQS_BY_TYPE_URL}/${type}`
      );

      return normalizeFaqResponse(
        res.data
      );

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch FAQs by type"
        )
      );
    }
  }
);

/* =========================================================
   GET FAQ BY CITY
========================================================= */

export const getFaqsByCityThunk = createAsyncThunk(
  "faq/getByCity",

  async (cityId, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(
        `${GET_FAQS_BY_CITY_URL}/${cityId}`
      );

      return normalizeFaqResponse(
        res.data
      );

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch city FAQs"
        )
      );
    }
  }
);

/* =========================================================
   GET FAQ BY SUBCITY
========================================================= */

export const getFaqsBySubCityThunk = createAsyncThunk(
  "faq/getBySubCity",

  async (subCityId, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(
        `${GET_FAQS_BY_SUBCITY_URL}/${subCityId}`
      );

      return normalizeFaqResponse(
        res.data
      );

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch subcity FAQs"
        )
      );
    }
  }
);

/* =========================================================
   GET FAQ BY GIRL
========================================================= */

export const getFaqsByGirlThunk = createAsyncThunk(
  "faq/getByGirl",

  async (girlId, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(
        `${GET_FAQS_BY_GIRL_URL}/${girlId}`
      );

      return normalizeFaqResponse(
        res.data
      );

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch girl FAQs"
        )
      );
    }
  }
);

/* =========================================================
   ADD FAQ
========================================================= */

export const addFaqThunk = createAsyncThunk(
  "faq/add",

  async (data, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.post(
        ADD_FAQ_URL,
        data
      );

      return res.data?.faq;

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to add FAQ"
        )
      );
    }
  }
);

/* =========================================================
   UPDATE FAQ
========================================================= */

export const updateFaqThunk = createAsyncThunk(
  "faq/update",

  async (
    { id, data },
    { rejectWithValue }
  ) => {
    try {

      const res = await axiosInstance.put(
        `${UPDATE_FAQ_URL}/${id}`,
        data
      );

      return res.data?.faq;

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to update FAQ"
        )
      );
    }
  }
);

/* =========================================================
   DELETE FAQ
========================================================= */

export const deleteFaqThunk = createAsyncThunk(
  "faq/delete",

  async (id, { rejectWithValue }) => {
    try {

      await axiosInstance.delete(
        `${DELETE_FAQ_URL}/${id}`
      );

      return id;

    } catch (error) {

      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to delete FAQ"
        )
      );
    }
  }
);

/* =========================================================
   TOGGLE FAQ STATUS
========================================================= */

export const toggleFaqStatusThunk =
  createAsyncThunk(
    "faq/status",

    async (id, { rejectWithValue }) => {
      try {

        const res = await axiosInstance.patch(
          `${TOGGLE_FAQ_STATUS_URL}/${id}`
        );

        return res.data?.faq;

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to toggle FAQ status"
          )
        );
      }
    }
  );

/* =========================================================
 GET FAQ BY VISIBILITY
========================================================= */

export const getFaqsByVisibilityThunk =
  createAsyncThunk(

    "faq/getByVisibility",

    async (
      {
        type,
        visible,
        cityId,
        subCityId,
        girlId,
      },
      { rejectWithValue }
    ) => {

      try {

        const params =
          new URLSearchParams();

        // TYPE
        if (type) {
          params.append("type", type);
        }

        // VISIBLE
        if (
          visible !== undefined
        ) {
          params.append(
            "visible",
            visible
          );
        }

        // CITY
        if (cityId) {
          params.append(
            "cityId",
            cityId
          );
        }

        // SUBCITY
        if (subCityId) {
          params.append(
            "subCityId",
            subCityId
          );
        }

        // GIRL
        if (girlId) {
          params.append(
            "girlId",
            girlId
          );
        }

        const res =
          await axiosInstance.get(
            `${GET_FAQS_BY_VISIBILITY_URL}?${params.toString()}`
          );

        return normalizeFaqResponse(
          res.data
        );

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(
            error,
            "Failed to fetch FAQs by visibility"
          )

        );
      }
    }
  );

/* =========================================================
   SLICE
========================================================= */

const faqSlice = createSlice({
  name: "faq",

  initialState: {
    faqs: [],
    loading: false,
    error: null,
  },

  reducers: {

    clearFaqError: (state) => {
      state.error = null;
    },

    clearFaqs: (state) => {
      state.faqs = [];
    },
  },

  extraReducers: (builder) => {

    builder

      /* ===================================================
         GET ALL
      =================================================== */

      .addCase(
        getFaqsThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFaqsThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getFaqsThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ===================================================
         GET HOMEPAGE
      =================================================== */

      .addCase(
        getHomepageFaqsThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getHomepageFaqsThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getHomepageFaqsThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ===================================================
         GET TYPE
      =================================================== */

      .addCase(
        getFaqsByTypeThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFaqsByTypeThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getFaqsByTypeThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ===================================================
         GET CITY
      =================================================== */

      .addCase(
        getFaqsByCityThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFaqsByCityThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getFaqsByCityThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ===================================================
         GET SUBCITY
      =================================================== */

      .addCase(
        getFaqsBySubCityThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFaqsBySubCityThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getFaqsBySubCityThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ===================================================
         GET GIRL
      =================================================== */

      .addCase(
        getFaqsByGirlThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFaqsByGirlThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getFaqsByGirlThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ===================================================
         ADD FAQ
      =================================================== */

      .addCase(
        addFaqThunk.fulfilled,
        (state, action) => {

          if (action.payload?._id) {

            state.faqs.unshift(
              action.payload
            );
          }
        }
      )

      /* ===================================================
         UPDATE FAQ
      =================================================== */

      .addCase(
        updateFaqThunk.fulfilled,
        (state, action) => {

          state.faqs = updateFaqInList(
            state.faqs,
            action.payload
          );
        }
      )

      /* ===================================================
         DELETE FAQ
      =================================================== */

      .addCase(
        deleteFaqThunk.fulfilled,
        (state, action) => {

          state.faqs = removeFaqFromList(
            state.faqs,
            action.payload
          );
        }
      )

      /* ===================================================
     TOGGLE STATUS
  =================================================== */

      .addCase(
        toggleFaqStatusThunk.fulfilled,
        (state, action) => {

          state.faqs = updateFaqInList(
            state.faqs,
            action.payload
          );
        }
      )

      /* ===================================================
         GET VISIBILITY
      =================================================== */

      .addCase(
        getFaqsByVisibilityThunk.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFaqsByVisibilityThunk.fulfilled,
        (state, action) => {

          state.loading = false;
          state.faqs = action.payload;
        }
      )

      .addCase(
        getFaqsByVisibilityThunk.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      );


  },
});

export const {
  clearFaqError,
  clearFaqs,
} = faqSlice.actions;

export default faqSlice.reducer;