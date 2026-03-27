import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "api/axiosInstance";

import {
  ADD_CITY_URL,
  GET_CITIES_URL,
  DELETE_CITY_URL,
  UPDATE_CITY_URL,
  CITY_STATUS_URL,
  GET_CITY_BY_ID_URL,
  GET_CITY_PAGE_URL,
} from "api/constant/constant";

/* =======================================================
   GET CITY PAGE (FIXED ✅)
======================================================= */
// citySlice.js

export const getCityPageThunk = createAsyncThunk(
  "city/getCityPage",
  async (citySlug, { rejectWithValue }) => {
    try {
      console.log("CALLING:", citySlug);

      const res = await axiosInstance.get(
        `${GET_CITY_PAGE_URL}/${citySlug}`
      );

      return res.data;
    } catch (error) {
      console.log("API ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch city page"
      );
    }
  }
);

/* =======================================================
   GET SINGLE CITY
======================================================= */
export const getCityByIdThunk = createAsyncThunk(
  "city/getById",
  async (cityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${GET_CITY_BY_ID_URL}/${cityId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch city"
      );
    }
  }
);

/* =======================================================
   ADD CITY
======================================================= */
export const addCityThunk = createAsyncThunk(
  "city/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(ADD_CITY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add city";

      if (
        error.response?.data?.message?.includes("E11000") ||
        error.response?.data?.message?.toLowerCase().includes("duplicate")
      ) {
        message = "City name already exists!";
      }

      return rejectWithValue(message);
    }
  }
);

/* =======================================================
   GET ALL CITIES (FIXED RESPONSE)
======================================================= */
export const getCitiesThunk = createAsyncThunk(
  "city/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_CITIES_URL);

      // ✅ handle both formats safely
      return res.data.cities || res.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cities"
      );
    }
  }
);

/* =======================================================
   DELETE CITY
======================================================= */
export const deleteCityThunk = createAsyncThunk(
  "city/delete",
  async (cityId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${DELETE_CITY_URL}/${cityId}`);
      return cityId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete city"
      );
    }
  }
);

/* =======================================================
   UPDATE CITY
======================================================= */
export const updateCityThunk = createAsyncThunk(
  "city/update",
  async ({ cityId, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `${UPDATE_CITY_URL}/${cityId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update city"
      );
    }
  }
);

/* =======================================================
   UPDATE STATUS
======================================================= */
export const updateCityStatusThunk = createAsyncThunk(
  "city/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`${CITY_STATUS_URL}/${id}`, {
        status,
      });

      return res.data.city;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

/* =======================================================
   SLICE
======================================================= */
const citySlice = createSlice({
  name: "city",

  initialState: {
    cities: [],
    singleCity: null,
    seo: null,
    schema: null,

    listLoading: false,
    addLoading: false,
    deleteLoading: false,
    updateLoading: false,
    statusLoading: false,

    error: null,
    success: null,
  },

  reducers: {
    resetCityState: (state) => {
      state.error = null;
      state.success = null;
      state.singleCity = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ADD */
      .addCase(addCityThunk.pending, (state) => {
        state.addLoading = true;
      })
      .addCase(addCityThunk.fulfilled, (state, action) => {
        state.addLoading = false;
        state.cities.unshift(action.payload);
        state.success = true;
      })
      .addCase(addCityThunk.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getCitiesThunk.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(getCitiesThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.cities = action.payload;
      })
      .addCase(getCitiesThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getCityByIdThunk.fulfilled, (state, action) => {
        state.singleCity = action.payload;
      })

      /* DELETE */
      .addCase(deleteCityThunk.fulfilled, (state, action) => {
        state.cities = state.cities.filter(
          (city) => city._id !== action.payload
        );
      })

      /* UPDATE */
      .addCase(updateCityThunk.fulfilled, (state, action) => {
        state.cities = state.cities.map((city) =>
          city._id === action.payload._id ? action.payload : city
        );
      })

      /* STATUS */
      .addCase(updateCityStatusThunk.fulfilled, (state, action) => {
        state.cities = state.cities.map((city) =>
          city._id === action.payload._id ? action.payload : city
        );
      })

      /* SEO PAGE */
      .addCase(getCityPageThunk.fulfilled, (state, action) => {
        state.singleCity = action.payload.city;
        state.seo = action.payload.seo;
        state.schema = action.payload.schema;
      });
  },
});

export const { resetCityState } = citySlice.actions;
export default citySlice.reducer;