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
   GET ALL FAQ
========================================================= */

export const getFaqsThunk = createAsyncThunk(
  "faq/getAll",

  async (_, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(
        GET_FAQS_URL
      );

      return normalizeFaqResponse(
        res.data
      );

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to fetch FAQs"
      );
    }
  }
);

/* =========================================================
   GET HOMEPAGE FAQ
========================================================= */

export const getHomepageFaqsThunk = createAsyncThunk(
  "faq/getHomepage",

  async (_, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(
        GET_HOMEPAGE_FAQS_URL
      );

      return normalizeFaqResponse(
        res.data
      );

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to fetch homepage FAQs"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to fetch FAQs by type"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to fetch city FAQs"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to fetch subcity FAQs"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to fetch girl FAQs"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to add FAQ"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to update FAQ"
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

    } catch (err) {

      return rejectWithValue(
        err?.response?.data?.message ||
        "Failed to delete FAQ"
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

      } catch (err) {

        return rejectWithValue(
          err?.response?.data?.message ||
          "Failed to toggle FAQ status"
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

          state.faqs = state.faqs.map(
            (faq) =>
              faq._id === action.payload._id
                ? action.payload
                : faq
          );
        }
      )

      /* ===================================================
         DELETE FAQ
      =================================================== */

      .addCase(
        deleteFaqThunk.fulfilled,
        (state, action) => {

          state.faqs = state.faqs.filter(
            (faq) =>
              faq._id !== action.payload
          );
        }
      )

      /* ===================================================
         TOGGLE STATUS
      =================================================== */

      .addCase(
        toggleFaqStatusThunk.fulfilled,
        (state, action) => {

          state.faqs = state.faqs.map(
            (faq) =>
              faq._id === action.payload._id
                ? action.payload
                : faq
          );
        }
      );
  },
});

export const {
  clearFaqError,
  clearFaqs,
} = faqSlice.actions;

export default faqSlice.reducer;