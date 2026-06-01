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

        console.log(
          "CITY PAGE CALL :",
          citySlug
        );

        const res =
          await axiosInstance.get(
            `${GET_CITY_PAGE_URL}/${citySlug}`
          );

        console.log(
          "CITY PAGE RESPONSE :",
          res.data
        );

        return res.data;

      } catch (error) {

        console.log(
          "CITY PAGE ERROR :",
          error.response?.data
        );

        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch city page"
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

        const res =
          await axiosInstance.get(
            `${GET_CITY_BY_ID_URL}/${cityId}`
          );

        return res.data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch city"
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

        const res =
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

        return (
          res.data?.data ||
          res.data
        );

      } catch (error) {

        let message =
          error.response?.data
            ?.message ||
          error.message ||
          "Failed to add city";

        // ✅ DUPLICATE ERROR
        if (
          error.response?.data?.message?.includes(
            "E11000"
          ) ||
          error.response?.data?.message
            ?.toLowerCase()
            .includes("duplicate")
        ) {
          message =
            "City already exists";
        }

        return rejectWithValue(
          message
        );
      }
    }
  );

/* =======================================================
   GET ALL CITIES
======================================================= */

export const getCitiesThunk =
  createAsyncThunk(
    "city/getAll",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {

        const res =
          await axiosInstance.get(
            GET_CITIES_URL
          );

        console.log(
          "ALL CITIES RESPONSE :",
          res.data
        );

        // ✅ HANDLE ALL FORMATS
        return (
          res.data?.cities ||
          res.data?.data ||
          res.data ||
          []
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch cities"
        );
      }
    }
  );

/* =======================================================
   DELETE CITY
======================================================= */

export const deleteCityThunk =
  createAsyncThunk(
    "city/delete",

    async (
      cityId,
      { rejectWithValue }
    ) => {
      try {

        await axiosInstance.delete(
          `${DELETE_CITY_URL}/${cityId}`
        );

        return cityId;

      } catch (error) {

        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to delete city"
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

      // DEBUG
      for (let pair of formData.entries()) {

        console.log(
          pair[0],
          pair[1]
        );
      }

      const res =
        await axiosInstance.put(
          `${UPDATE_CITY_URL}/${cityId}`,
          formData
        );

      console.log(
        "UPDATE RESPONSE :",
        res.data
      );

      return (
        res.data?.data ||
        res.data?.city ||
        res.data
      );

    } catch (error) {

      console.log(
        "UPDATE ERROR :",
        error
      );

      console.log(
        "ERROR RESPONSE :",
        error.response?.data
      );

      return rejectWithValue(
        error.response?.data ||
        {
          message:
            "Failed to update city",
        }
      );
    }
  }
);

/* =======================================================
   UPDATE STATUS (FULL FIXED ✅)
======================================================= */

export const updateCityStatusThunk =
  createAsyncThunk(
    "city/updateStatus",

    async (
      { id, status },
      { rejectWithValue }
    ) => {
      try {

        console.log(
          "STATUS UPDATE :",
          {
            id,
            status,
          }
        );

        const res =
          await axiosInstance.patch(
            `${CITY_STATUS_URL}/${id}`,
            { status }
          );

        console.log(
          "STATUS RESPONSE :",
          res.data
        );

        // ✅ HANDLE ALL RESPONSE TYPES
        return (
          res.data?.city ||
          res.data?.data ||
          res.data
        );

      } catch (error) {

        console.log(
          "STATUS ERROR :",
          error.response?.data
        );

        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update status"
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

          state.success = true;
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

          state.cities =
            state.cities.filter(
              (city) =>
                city._id !==
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
          if (
            !action.payload?._id
          )
            return;

          state.cities =
            state.cities.map(
              (city) => {

                if (
                  city._id ===
                  action.payload._id
                ) {
                  return {
                    ...city,
                    ...action.payload,
                  };
                }

                return city;
              }
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

          console.log(
            "UPDATED STATUS PAYLOAD :",
            action.payload
          );

          // ✅ CRASH PROTECTION
          if (
            !action.payload?._id
          )
            return;

          state.cities =
            state.cities.map(
              (city) => {

                if (
                  city._id ===
                  action.payload._id
                ) {
                  return {
                    ...city,
                    ...action.payload,
                  };
                }

                return city;
              }
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

          console.log(
            "CITY PAGE PAYLOAD :",
            action.payload
          );

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