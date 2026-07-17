import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "api/axiosInstance";

import {
  ADD_GIRL_URL,
  GET_ALL_GIRLS_URL,
  GET_GIRLS_BY_CITY_URL,
  GET_SINGLE_GIRL_URL,
  GET_GIRLS_BY_SUBCITY_URL,
  GET_GIRL_BY_SLUG_URL,
  DELETE_GIRL_URL,
  TOGGLE_GIRL_STATUS_URL,
  UPDATE_GIRL_URL,
} from "api/constant/constant";

/* =======================================================
    🔵 HELPER: NORMALIZER
======================================================= */
const normalizeArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.girls)) return res.girls;
  return [];
};


/* =======================================================
    🔵 COMMON HELPERS
======================================================= */

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
  response?.data?.girl ??
  response?.data?.girls ??
  response?.data?.data ??
  response?.data;

const updateGirlInList = (
  girls,
  updatedGirl
) => {
  if (!updatedGirl?._id) return girls;

  return girls.map((girl) =>
    girl._id === updatedGirl._id
      ? updatedGirl
      : girl
  );
};

const removeGirlFromList = (
  girls,
  id
) =>
  girls.filter(
    (girl) => girl._id !== id
  );

/* =======================================================
    🚀 ASYNC THUNKS
======================================================= */

// GET ALL
/* =======================================================
    🚀 GET ALL GIRLS
======================================================= */

export const getAllGirlsThunk =
  createAsyncThunk(
    "girls/getAll",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.get(
            GET_ALL_GIRLS_URL
          );

        return normalizeArray(
          data
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load girls"
          )
        );

      }
    }
  );

/* =======================================================
    🚀 GET GIRLS BY CITY
======================================================= */

export const getGirlsByCityThunk =
  createAsyncThunk(
    "girls/getByCity",

    async (
      { cityId, page = 1 },
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.get(
            `${GET_GIRLS_BY_CITY_URL}/${cityId}?page=${page}`
          );

        return {
          cityId,
          page,
          data,
        };

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load city girls"
          )
        );

      }
    }
  );

/* =======================================================
    🚀 GET GIRLS BY SUB-CITY
======================================================= */

export const getGirlsBySubCityThunk =
  createAsyncThunk(
    "girls/getBySubCity",

    async (
      { subCityId, page = 1 },
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.get(
            `${GET_GIRLS_BY_SUBCITY_URL}/${subCityId}?page=${page}`
          );

        return {
          subCityId,
          page,
          data,
        };

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load subcity girls"
          )
        );

      }
    }
  );

/* =======================================================
    🚀 GET GIRL BY SLUG
======================================================= */

export const getGirlBySlugThunk =
  createAsyncThunk(
    "girls/getBySlug",

    async (
      slug,
      { rejectWithValue }
    ) => {
      try {

        const response =
          await axiosInstance.get(
            `${GET_GIRL_BY_SLUG_URL}/${slug}`
          );

        return getResponseData(
          response
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Profile not found"
          )
        );

      }
    }
  );


/* =======================================================
    🚀 ADD GIRL
======================================================= */

export const addGirlThunk =
  createAsyncThunk(
    "girls/add",

    async (
      formData,
      { rejectWithValue }
    ) => {
      try {

        const response =
          await axiosInstance.post(
            ADD_GIRL_URL,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return getResponseData(
          response
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to add record"
          )
        );

      }
    }
  );

/* =======================================================
    🚀 DELETE GIRL
======================================================= */

export const deleteGirlThunk =
  createAsyncThunk(
    "girls/delete",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {

        await axiosInstance.delete(
          `${DELETE_GIRL_URL}/${id}`
        );

        return id;

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Delete failed"
          )
        );

      }
    }
  );

/* =======================================================
    🚀 UPDATE GIRL
======================================================= */

export const updateGirlThunk =
  createAsyncThunk(
    "girls/update",

    async (
      { id, formData },
      { rejectWithValue }
    ) => {
      try {

        const response =
          await axiosInstance.put(
            `${UPDATE_GIRL_URL}/${id}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return getResponseData(
          response
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Update failed"
          )
        );

      }
    }
  );


/* =======================================================
    🚀 TOGGLE GIRL STATUS
======================================================= */

export const toggleGirlStatusThunk =
  createAsyncThunk(
    "girls/toggleStatus",

    async (
      { id, status },
      { rejectWithValue }
    ) => {
      try {

        const { data } =
          await axiosInstance.patch(
            `${TOGGLE_GIRL_STATUS_URL}/${id}`,
            { status }
          );

        return {
          id,
          status:
            data?.status ??
            data?.girl?.status ??
            data?.data?.status ??
            status,
        };

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Status update failed"
          )
        );

      }
    }
  );


/* =======================================================
  🚀 GET GIRL BY ID
======================================================= */

export const getGirlByIdThunk =
  createAsyncThunk(
    "girls/getById",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {

        const response =
          await axiosInstance.get(
            `${GET_SINGLE_GIRL_URL}/${id}`
          );

        return getResponseData(
          response
        );

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load girl"
          )
        );

      }
    }
  );

/* =======================================================
    🎯 SLICE DEFINITION
======================================================= */
const girlSlice = createSlice({
  name: "girls",
  initialState: {
    girls: [],
    cityGirls: [],
    cityGirlsPagination: null,
    subCityGirlsPagination: null,
    cityGirlsById: {},
    singleGirl: null,
    listLoading: false,
    cityLoading: false,
    cityLoaded: false,
    singleLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetGirlState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearSingleGirl: (state) => {
      state.singleGirl = null;
    }
  },
  extraReducers: (builder) => {
    builder

      /* =======================================================
          GET ALL GIRLS
      ======================================================= */

      .addCase(getAllGirlsThunk.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })

      .addCase(getAllGirlsThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.girls = action.payload;
      })

      .addCase(getAllGirlsThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      /* =======================================================
          GET GIRLS BY CITY
      ======================================================= */

      .addCase(getGirlsByCityThunk.pending, (state) => {
        state.cityLoading = true;
        state.cityLoaded = false;
        state.error = null;
      })

      .addCase(getGirlsByCityThunk.fulfilled, (state, action) => {
  state.cityLoading = false;
  state.cityLoaded = true;

  state.cityGirls = action.payload.data.data;
  state.cityGirlsPagination =
    action.payload.data.pagination;
})

     .addCase(getGirlsByCityThunk.rejected, (state, action) => {
  state.cityLoading = false;
  state.cityLoaded = true;
  state.error = action.payload;
})

      /* =======================================================
          GET GIRLS BY SUBCITY
      ======================================================= */

      .addCase(getGirlsBySubCityThunk.pending, (state) => {
        state.cityLoading = true;
        state.error = null;
      })

      .addCase(getGirlsBySubCityThunk.fulfilled, (state, action) => {
        const { data } = action.payload;

        state.cityLoading = false;
        state.cityGirls = data.data;
        state.subCityGirlsPagination = data.pagination;
      })

      .addCase(getGirlsBySubCityThunk.rejected, (state, action) => {
        state.cityLoading = false;
        state.error = action.payload;
      })

      /* =======================================================
          GET GIRL BY SLUG
      ======================================================= */

      .addCase(getGirlBySlugThunk.pending, (state) => {
        state.singleLoading = true;
        state.error = null;
      })

      .addCase(getGirlBySlugThunk.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.singleGirl = action.payload;
      })

      .addCase(getGirlBySlugThunk.rejected, (state, action) => {
        state.singleLoading = false;
        state.error = action.payload;
      })

      /* =======================================================
          GET GIRL BY ID
      ======================================================= */

      .addCase(getGirlByIdThunk.pending, (state) => {
        state.singleLoading = true;
        state.error = null;
      })

      .addCase(getGirlByIdThunk.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.singleGirl = action.payload;
      })

      .addCase(getGirlByIdThunk.rejected, (state, action) => {
        state.singleLoading = false;
        state.error = action.payload;
      })

      /* =======================================================
          ADD GIRL
      ======================================================= */

      .addCase(addGirlThunk.fulfilled, (state, action) => {
        if (action.payload?._id) {
          state.girls.unshift(action.payload);
        }

        state.success = true;
        state.error = null;
      })

      /* =======================================================
          DELETE GIRL
      ======================================================= */

      .addCase(deleteGirlThunk.fulfilled, (state, action) => {
        const id = action.payload;

        state.girls = removeGirlFromList(
          state.girls,
          id
        );

        state.cityGirls = removeGirlFromList(
          state.cityGirls,
          id
        );

        if (state.singleGirl?._id === id) {
          state.singleGirl = null;
        }
      })

      /* =======================================================
          UPDATE GIRL
      ======================================================= */

      .addCase(updateGirlThunk.fulfilled, (state, action) => {
        const updatedGirl = action.payload;

        state.girls = updateGirlInList(
          state.girls,
          updatedGirl
        );

        state.cityGirls = updateGirlInList(
          state.cityGirls,
          updatedGirl
        );

        if (
          state.singleGirl?._id ===
          updatedGirl._id
        ) {
          state.singleGirl = updatedGirl;
        }

        state.success = true;
        state.error = null;
      })

      /* =======================================================
          TOGGLE STATUS
      ======================================================= */

      .addCase(toggleGirlStatusThunk.fulfilled, (state, action) => {
        const { id, status } = action.payload;

        state.girls = state.girls.map((girl) =>
          girl._id === id
            ? { ...girl, status }
            : girl
        );

        state.cityGirls = state.cityGirls.map((girl) =>
          girl._id === id
            ? { ...girl, status }
            : girl
        );

        if (state.singleGirl?._id === id) {
          state.singleGirl = {
            ...state.singleGirl,
            status,
          };
        }
      });
  },
});

export const { resetGirlState, clearSingleGirl } = girlSlice.actions;
export default girlSlice.reducer;