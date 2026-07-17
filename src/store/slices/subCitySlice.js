import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  ADD_SUBCITY_URL,
  GET_SUBCITIES_URL,
  GET_SUBCITY_BY_ID_URL,
  UPDATE_SUBCITY_URL,
  DELETE_SUBCITY_URL,
  SUBCITY_STATUS_URL,
  GET_SUBCITIES_BY_CITY_URL
} from "api/constant/constant";

import { axiosInstance } from "api/axiosInstance";

/* =======================================================
    🔵 COMMON HELPERS
======================================================= */

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.data))
    return data.data;

  if (Array.isArray(data?.subCities))
    return data.subCities;

  return [];
};

const getErrorMessage = (
  error,
  fallback
) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const getResponseData = (
  response
) =>
  response?.data?.subCity ??
  response?.data?.subCities ??
  response?.data?.data ??
  response?.data;

const updateSubCityInList = (
  list,
  updated
) =>
  list.map((item) =>
    item._id === updated._id
      ? updated
      : item
  );

const removeSubCityFromList = (
  list,
  id
) =>
  list.filter(
    (item) => item._id !== id
  );

/* ================================================= */
/* ================= CREATE ======================== */
/* ================================================= */

export const createSubCity =
  createAsyncThunk(
    "subCity/create",

    async (
      formData,
      { rejectWithValue }
    ) => {

      try {

        const response =
          await axiosInstance.post(
            ADD_SUBCITY_URL,
            formData,
            true
          );

        return getResponseData(
          response
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to create subcity"
          )
        );

      }

    }
  );

/* ================================================= */
/* ================= GET ALL ======================= */
/* ================================================= */

export const fetchSubCities =
  createAsyncThunk(
    "subCity/fetchAll",

    async (
      _,
      { rejectWithValue }
    ) => {

      try {

        const { data } =
          await axiosInstance.get(
            GET_SUBCITIES_URL
          );

        return normalizeArray(
          data
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch subcities"
          )
        );

      }

    }
  );

/* ================================================= */
/* ============= GET SUBCITY BY CITY ============== */
/* ================================================= */

export const fetchSubCitiesByCity =
  createAsyncThunk(
    "subCity/fetchByCity",

    async (cityId, { rejectWithValue }) => {

      try {

        const { data } =
          await axiosInstance.get(
            `${GET_SUBCITIES_BY_CITY_URL}/${cityId}`
          );

        return normalizeArray(
          data
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch subcities by city"
          )
        );

      }
    }
  );

/* ================================================= */
/* ================= GET BY ID ===================== */
/* ================================================= */

export const fetchSubCityById =
  createAsyncThunk(
    "subCity/fetchById",

    async (id, { rejectWithValue }) => {

      try {

        const url =
          `${GET_SUBCITY_BY_ID_URL}/${id}`;

        console.log(
          "API URL 👉",
          url
        );

        const { data } =
          await axiosInstance.get(url);

        return data;

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch subcity by ID"
          )
        );

      }
    }
  );

/* ================================================= */
/* ================= GET BY SLUG =================== */
/* ================================================= */

export const fetchSubCityBySlug =
  createAsyncThunk(
    "subCity/fetchBySlug",

    async (slug, { rejectWithValue }) => {

      try {

        const { data } =
          await axiosInstance.get(
            `/api/subcities/page/${slug}`
          );

        console.log(
          "SUBCITY SLUG RESPONSE 👉",
          data
        );

        return (
          data?.subCity ||
          data
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch subcity by slug"
          )
        );

      }
    }
  );

/* ================================================= */
/* ================= UPDATE ======================== */
/* ================================================= */

export const updateSubCity =
  createAsyncThunk(
    "subCity/update",

    async (
      { id, formData },
      { rejectWithValue }
    ) => {

      try {

        const { data } =
          await axiosInstance.put(
            `${UPDATE_SUBCITY_URL}/${id}`,
            formData,
            true
          );

        return data;

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update subcity"
          )
        );

      }
    }
  );

/* ================================================= */
/* ================= DELETE ======================== */
/* ================================================= */

export const deleteSubCity =
  createAsyncThunk(
    "subCity/delete",

    async (id, { rejectWithValue }) => {

      try {

        await axiosInstance.delete(
          `${DELETE_SUBCITY_URL}/${id}`,
          true
        );

        return id;

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to delete subcity"
          )
        );

      }
    }
  );

/* ================================================= */
/* ================= STATUS ======================== */
/* ================================================= */

export const toggleSubCityStatus =
  createAsyncThunk(
    "subCity/status",

    async (id, { rejectWithValue }) => {

      try {

        const res =
          await axiosInstance.patch(
            `${SUBCITY_STATUS_URL}/${id}`,
            {},
            true
          );

        return {
          id,
          status: res.data.status
        };

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to toggle subcity status"
          )
        );

      }
    }
  );

/* ================================================= */
/* ================= SLICE ========================= */
/* ================================================= */

const subCitySlice = createSlice({

  name: "subCity",

  initialState: {

    subCities: [],

    selectedSubCity: null,

    loading: false,

    error: null

  },

  reducers: {

    clearSubCity: (state) => {

      state.selectedSubCity = null;

    }

  },

  extraReducers: (builder) => {

    builder

      /* ================= CREATE ================= */

      .addCase(createSubCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createSubCity.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?._id) {
          state.subCities.unshift(action.payload);
        }
      })

      .addCase(createSubCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET ALL ================= */

      .addCase(fetchSubCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSubCities.fulfilled, (state, action) => {
        state.loading = false;
        state.subCities = action.payload;
      })

      .addCase(fetchSubCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY CITY ================= */

      .addCase(fetchSubCitiesByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSubCitiesByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.subCities = action.payload;
      })

      .addCase(fetchSubCitiesByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY ID ================= */

      .addCase(fetchSubCityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSubCityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubCity = action.payload;
      })

      .addCase(fetchSubCityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET BY SLUG ================= */

      .addCase(fetchSubCityBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSubCityBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubCity = action.payload;
      })

      .addCase(fetchSubCityBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */

      .addCase(updateSubCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSubCity.fulfilled, (state, action) => {
        state.loading = false;

        state.subCities = updateSubCityInList(
          state.subCities,
          action.payload
        );

        if (
          state.selectedSubCity?._id ===
          action.payload._id
        ) {
          state.selectedSubCity =
            action.payload;
        }
      })

      .addCase(updateSubCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */

      .addCase(deleteSubCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteSubCity.fulfilled, (state, action) => {
        state.loading = false;

        state.subCities =
          removeSubCityFromList(
            state.subCities,
            action.payload
          );

        if (
          state.selectedSubCity?._id ===
          action.payload
        ) {
          state.selectedSubCity = null;
        }
      })

      .addCase(deleteSubCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= STATUS ================= */

      .addCase(toggleSubCityStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleSubCityStatus.fulfilled, (state, action) => {
        state.loading = false;

        const { id, status } =
          action.payload;

        state.subCities =
          state.subCities.map((item) =>
            item._id === id
              ? {
                ...item,
                status,
              }
              : item
          );

        if (
          state.selectedSubCity?._id ===
          id
        ) {
          state.selectedSubCity = {
            ...state.selectedSubCity,
            status,
          };
        }
      })

      .addCase(toggleSubCityStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }

});

export const {
  clearSubCity
} = subCitySlice.actions;

export default subCitySlice.reducer;