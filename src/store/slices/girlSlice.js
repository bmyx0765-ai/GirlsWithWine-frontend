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
    🚀 ASYNC THUNKS
======================================================= */

// GET ALL
export const getAllGirlsThunk = createAsyncThunk(
  "girls/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_ALL_GIRLS_URL);
      return normalizeArray(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load girls");
    }
  }
);

// GET BY CITY (Caching removed inside thunk for fresh data on navigation)
export const getGirlsByCityThunk = createAsyncThunk(
  "girls/getByCity",
  async (cityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${GET_GIRLS_BY_CITY_URL}/${cityId}`);
      return { cityId, data: normalizeArray(res.data) };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load city girls");
    }
  }
);

// GET BY SUB-CITY
export const getGirlsBySubCityThunk = createAsyncThunk(
  "girls/getBySubCity",
  async (subCityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${GET_GIRLS_BY_SUBCITY_URL}/${subCityId}`);
      return normalizeArray(res.data);
    } catch (err) {
      return rejectWithValue("Failed to load subcity girls");
    }
  }
);

// GET BY ID
export const getGirlByIdThunk = createAsyncThunk(
  "girls/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${GET_SINGLE_GIRL_URL}/${id}`);
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load girl");
    }
  }
);

// GET BY SLUG
export const getGirlBySlugThunk = createAsyncThunk(
  "girls/getBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${GET_GIRL_BY_SLUG_URL}/${slug}`);
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile not found");
    }
  }
);

// ADD
export const addGirlThunk = createAsyncThunk(
  "girls/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(ADD_GIRL_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add record");
    }
  }
);

// DELETE
export const deleteGirlThunk = createAsyncThunk(
  "girls/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${DELETE_GIRL_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// UPDATE
export const updateGirlThunk = createAsyncThunk(
  "girls/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`${UPDATE_GIRL_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.girl || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// TOGGLE STATUS
export const toggleGirlStatusThunk = createAsyncThunk(
  "girls/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`${TOGGLE_GIRL_STATUS_URL}/${id}`, { status });
      return { id, status: res.data.status || status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Status update failed");
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
    cityGirlsById: {},
    singleGirl: null,
    listLoading: false,
    cityLoading: false,
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
      /* --- GET ALL --- */
      .addCase(getAllGirlsThunk.pending, (state) => { state.listLoading = true; })
      .addCase(getAllGirlsThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.girls = action.payload;
      })
      .addCase(getAllGirlsThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      /* --- CITY/SUB-CITY --- */
      .addCase(getGirlsByCityThunk.pending, (state) => { state.cityLoading = true; })
      .addCase(getGirlsByCityThunk.fulfilled, (state, action) => {
        state.cityLoading = false;
        state.cityGirls = action.payload.data;
        state.cityGirlsById[action.payload.cityId] = action.payload.data;
      })
      .addCase(getGirlsBySubCityThunk.fulfilled, (state, action) => {
        state.cityGirls = action.payload;
      })

      /* --- SINGLE GIRL (SLUG/ID) --- */
      .addCase(getGirlBySlugThunk.pending, (state) => { state.singleLoading = true; })
      .addCase(getGirlBySlugThunk.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.singleGirl = action.payload;
      })
      .addCase(getGirlByIdThunk.fulfilled, (state, action) => {
        state.singleGirl = action.payload;
      })

      /* --- ADD --- */
      .addCase(addGirlThunk.fulfilled, (state, action) => {
        state.girls.unshift(action.payload);
        state.success = true;
      })

      /* --- DELETE --- */
      .addCase(deleteGirlThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.girls = state.girls.filter((g) => g._id !== id);
        state.cityGirls = state.cityGirls.filter((g) => g._id !== id);
        if (state.singleGirl?._id === id) state.singleGirl = null;
      })

      /* --- UPDATE --- */
      .addCase(updateGirlThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.girls = state.girls.map((g) => (g._id === updated._id ? updated : g));
        state.cityGirls = state.cityGirls.map((g) => (g._id === updated._id ? updated : g));
        if (state.singleGirl?._id === updated._id) state.singleGirl = updated;
        state.success = true;
        state.error = null;
      })

      /* --- TOGGLE STATUS --- */
      .addCase(toggleGirlStatusThunk.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const updateFn = (g) => g._id === id ? { ...g, status } : g;
        state.girls = state.girls.map(updateFn);
        state.cityGirls = state.cityGirls.map(updateFn);
        if (state.singleGirl?._id === id) state.singleGirl.status = status;
      });
  },
});

export const { resetGirlState, clearSingleGirl } = girlSlice.actions;
export default girlSlice.reducer;