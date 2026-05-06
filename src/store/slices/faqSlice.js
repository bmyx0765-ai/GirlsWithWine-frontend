// store/slices/faqSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "api/axiosInstance";

import {
  ADD_FAQ_URL,
  GET_FAQS_URL,
  GET_FAQS_BY_TYPE_URL,
  GET_FAQS_BY_CITY_URL,
  GET_FAQS_BY_SUBCITY_URL,
  GET_FAQS_BY_GIRL_URL,
  UPDATE_FAQ_URL,
  DELETE_FAQ_URL,
  TOGGLE_FAQ_STATUS_URL,
} from "api/constant/constant";

/* ================= NORMALIZER ================= */

const normalizeArray = (res) => {
  if (Array.isArray(res)) return res;

  if (Array.isArray(res?.data)) {
    return res.data;
  }

  return [];
};

/* ================= GET ALL ================= */

export const getFaqsThunk = createAsyncThunk(
  "faq/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_FAQS_URL);

      return normalizeArray(res.data);
    } catch {
      return rejectWithValue("Failed to load FAQs");
    }
  }
);

/* ================= GET BY TYPE ================= */

export const getFaqsByTypeThunk = createAsyncThunk(
  "faq/getByType",
  async (type, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${GET_FAQS_BY_TYPE_URL}/${type}`
      );

      return normalizeArray(res.data);
    } catch {
      return rejectWithValue("Failed to load FAQs by type");
    }
  }
);

/* ================= GET BY CITY ================= */

export const getFaqsByCityThunk = createAsyncThunk(
  "faq/getByCity",
  async (cityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${GET_FAQS_BY_CITY_URL}/${cityId}`
      );

      return normalizeArray(res.data);
    } catch {
      return rejectWithValue("Failed to load city FAQs");
    }
  }
);

/* ================= GET BY SUBCITY ================= */

export const getFaqsBySubCityThunk = createAsyncThunk(
  "faq/getBySubCity",
  async (subCityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${GET_FAQS_BY_SUBCITY_URL}/${subCityId}`
      );

      return normalizeArray(res.data);
    } catch {
      return rejectWithValue("Failed to load subcity FAQs");
    }
  }
);

/* ================= GET BY GIRL ================= */

export const getFaqsByGirlThunk = createAsyncThunk(
  "faq/getByGirl",
  async (girlId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${GET_FAQS_BY_GIRL_URL}/${girlId}`
      );

      return normalizeArray(res.data);
    } catch {
      return rejectWithValue("Failed to load girl FAQs");
    }
  }
);

/* ================= ADD ================= */

export const addFaqThunk = createAsyncThunk(
  "faq/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        ADD_FAQ_URL,
        data
      );

      return res.data;
    } catch {
      return rejectWithValue("Failed to add FAQ");
    }
  }
);

/* ================= UPDATE ================= */

export const updateFaqThunk = createAsyncThunk(
  "faq/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `${UPDATE_FAQ_URL}/${id}`,
        data
      );

      return res.data;
    } catch {
      return rejectWithValue("Failed to update FAQ");
    }
  }
);

/* ================= DELETE ================= */

export const deleteFaqThunk = createAsyncThunk(
  "faq/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${DELETE_FAQ_URL}/${id}`
      );

      return id;
    } catch {
      return rejectWithValue("Failed to delete FAQ");
    }
  }
);

/* ================= STATUS ================= */

export const toggleFaqStatusThunk = createAsyncThunk(
  "faq/status",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `${TOGGLE_FAQ_STATUS_URL}/${id}`
      );

      return res.data;
    } catch {
      return rejectWithValue("Failed to update status");
    }
  }
);

/* ================= SLICE ================= */

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
  },

  extraReducers: (builder) => {
    builder

      /* ================= GET ALL ================= */

      .addCase(getFaqsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFaqsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })

      .addCase(getFaqsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY TYPE ================= */

      .addCase(getFaqsByTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFaqsByTypeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })

      .addCase(getFaqsByTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY CITY ================= */

      .addCase(getFaqsByCityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFaqsByCityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })

      .addCase(getFaqsByCityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY SUBCITY ================= */

      .addCase(getFaqsBySubCityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFaqsBySubCityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })

      .addCase(getFaqsBySubCityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY GIRL ================= */

      .addCase(getFaqsByGirlThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFaqsByGirlThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })

      .addCase(getFaqsByGirlThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= ADD ================= */

      .addCase(addFaqThunk.fulfilled, (state, action) => {
        state.faqs.unshift(action.payload);
      })

      /* ================= DELETE ================= */

      .addCase(deleteFaqThunk.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter(
          (f) => f._id !== action.payload
        );
      })

      /* ================= UPDATE ================= */

      .addCase(updateFaqThunk.fulfilled, (state, action) => {
        state.faqs = state.faqs.map((f) =>
          f._id === action.payload._id
            ? action.payload
            : f
        );
      })

      /* ================= STATUS ================= */

      .addCase(toggleFaqStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;

        state.faqs = state.faqs.map((f) =>
          f._id === updated._id
            ? updated
            : f
        );
      });
  },
});

export const { clearFaqError } = faqSlice.actions;

export default faqSlice.reducer;