import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

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
   COMMON HELPERS
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
  response?.data?.city ??
  response?.data?.cities ??
  response?.data?.data ??
  response?.data;

const updateCityInList = (
  cities,
  updatedCity
) => {
  if (!updatedCity?._id) return cities;

  return cities.map((city) =>
    city._id === updatedCity._id
      ? {
        ...city,
        ...updatedCity,
      }
      : city
  );
};

const removeCityFromList = (
  cities,
  cityId
) => {
  return cities.filter(
    (city) => city._id !== cityId
  );
};

/* =======================================================
   GET CITY PAGE
======================================================= */

export const getCityPageThunk =
  createAsyncThunk(
    "city/getCityPage",

    async (
      citySlug,
      { rejectWithValue }
    ) => {
      try {

        const response =
          await axiosInstance.get(
            `${GET_CITY_PAGE_URL}/${citySlug}`
          );

        return getResponseData(response);

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch city page"
          )
        );

      }
    }
  );

/* =======================================================
   GET SINGLE CITY
======================================================= */

export const getCityByIdThunk =
  createAsyncThunk(
    "city/getById",

    async (
      cityId,
      { rejectWithValue }
    ) => {

      try {

        const response =
          await axiosInstance.get(
            `${GET_CITY_BY_ID_URL}/${cityId}`
          );

        return getResponseData(response);

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch city"
          )
        );

      }
    }
  );

/* =======================================================
   ADD CITY
======================================================= */

export const addCityThunk =
  createAsyncThunk(
    "city/add",

    async (
      formData,
      { rejectWithValue }
    ) => {

      try {

        const response =
          await axiosInstance.post(
            ADD_CITY_URL,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return getResponseData(response);

      } catch (error) {

        let message =
          getErrorMessage(
            error,
            "Failed to add city"
          );

        const duplicate =
          error?.response?.data?.message
            ?.toLowerCase();

        if (
          duplicate?.includes("duplicate") ||
          duplicate?.includes("e11000")
        ) {
          message =
            "City already exists";
        }

        return rejectWithValue(message);

      }
    }
  );

/* =======================================================
   GET ALL CITIES
======================================================= */

export const getCitiesThunk = createAsyncThunk(
  "city/getAll",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        GET_CITIES_URL
      );

      return getResponseData(response) || [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch cities"
        )
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
      await axiosInstance.delete(
        `${DELETE_CITY_URL}/${cityId}`
      );

      return cityId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to delete city"
        )
      );
    }
  }
);

/* =======================================================
   UPDATE CITY
======================================================= */

export const updateCityThunk = createAsyncThunk(
  "city/update",

  async (
    { cityId, formData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `${UPDATE_CITY_URL}/${cityId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to update city"
        )
      );
    }
  }
);

/* =======================================================
   UPDATE STATUS
======================================================= */

export const updateCityStatusThunk =
  createAsyncThunk(
    "city/updateStatus",

    async (
      { id, status },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axiosInstance.patch(
            `${CITY_STATUS_URL}/${id}`,
            { status }
          );

        return getResponseData(response);
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update status"
          )
        );
      }
    }
  );

/* =======================================================
   INITIAL STATE
======================================================= */

const initialState = {
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
};

/* =======================================================
   SLICE
======================================================= */

const citySlice = createSlice({
  name: "city",

  initialState,

  reducers: {

    resetCityState: (
      state
    ) => {

      state.error = null;
      state.success = null;

      state.singleCity = null;
    },
  },

  extraReducers: (
    builder
  ) => {

    builder

      /* =======================================================
         ADD CITY
      ======================================================= */

      .addCase(
        addCityThunk.pending,
        (state) => {

          state.addLoading = true;
          state.error = null;
        }
      )

      .addCase(
        addCityThunk.fulfilled,
        (state, action) => {

          state.addLoading = false;

          state.cities.unshift(
            action.payload
          );

          state.success = "City added successfully.";
        }
      )

      .addCase(
        addCityThunk.rejected,
        (state, action) => {

          state.addLoading = false;

          state.error =
            action.payload;
        }
      )

      /* =======================================================
         GET ALL CITIES
      ======================================================= */

      .addCase(
        getCitiesThunk.pending,
        (state) => {

          state.listLoading = true;
        }
      )

      .addCase(
        getCitiesThunk.fulfilled,
        (state, action) => {

          state.listLoading = false;

          state.cities =
            action.payload;
        }
      )

      .addCase(
        getCitiesThunk.rejected,
        (state, action) => {

          state.listLoading = false;

          state.error =
            action.payload;
        }
      )

      /* =======================================================
         GET SINGLE CITY
      ======================================================= */

      .addCase(
        getCityByIdThunk.fulfilled,
        (state, action) => {

          state.singleCity =
            action.payload;
        }
      )

      /* =======================================================
         DELETE CITY
      ======================================================= */

      .addCase(
        deleteCityThunk.pending,
        (state) => {

          state.deleteLoading = true;
        }
      )

      .addCase(
        deleteCityThunk.fulfilled,
        (state, action) => {

          state.deleteLoading = false;

          state.cities = removeCityFromList(
            state.cities,
            action.payload
          );
        }
      )

      .addCase(
        deleteCityThunk.rejected,
        (state, action) => {

          state.deleteLoading = false;

          state.error =
            action.payload;
        }
      )

      /* =======================================================
         UPDATE CITY
      ======================================================= */

      .addCase(
        updateCityThunk.pending,
        (state) => {

          state.updateLoading = true;
        }
      )

      .addCase(
        updateCityThunk.fulfilled,
        (state, action) => {

          state.updateLoading = false;

          // ✅ CRASH PROTECTION
          if (!action.payload?._id) return;

          state.cities = updateCityInList(
            state.cities,
            action.payload
          );
        }
      )

      .addCase(
        updateCityThunk.rejected,
        (state, action) => {

          state.updateLoading = false;

          state.error =
            action.payload;
        }
      )

      /* =======================================================
         STATUS UPDATE FIXED ✅
      ======================================================= */

      .addCase(
        updateCityStatusThunk.pending,
        (state) => {

          state.statusLoading = true;
        }
      )

      .addCase(
        updateCityStatusThunk.fulfilled,
        (state, action) => {

          state.statusLoading = false;



          // ✅ CRASH PROTECTION
          if (!action.payload?._id) return;

          state.cities = updateCityInList(
            state.cities,
            action.payload
          );
        }
      )

      .addCase(
        updateCityStatusThunk.rejected,
        (state, action) => {

          state.statusLoading = false;

          state.error =
            action.payload;
        }
      )

      /* =======================================================
         CITY PAGE
      ======================================================= */

      .addCase(
        getCityPageThunk.pending,
        (state) => {

          state.listLoading = true;
        }
      )

      .addCase(
        getCityPageThunk.fulfilled,
        (state, action) => {

          state.listLoading = false;



          // ✅ HANDLE ALL RESPONSE TYPES
          state.singleCity =
            action.payload?.city ||
            action.payload;

          state.seo =
            action.payload?.seo ||
            null;

          state.schema =
            action.payload?.schema ||
            null;
        }
      )

      .addCase(
        getCityPageThunk.rejected,
        (state, action) => {

          state.listLoading = false;

          state.error =
            action.payload;
        }
      );
  },
});

export const {
  resetCityState,
} = citySlice.actions;

export default citySlice.reducer;