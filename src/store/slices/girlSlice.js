import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "api/axiosInstance";

import {
  ADD_GIRL_URL,
  GET_ALL_GIRLS_URL,
  GET_GIRLS_BY_CITY_URL,
  GET_SINGLE_GIRL_URL,
  GET_GIRL_BY_SLUG_URL,
  DELETE_GIRL_URL,
  TOGGLE_GIRL_STATUS_URL,
  UPDATE_GIRL_URL,
} from "api/constant/constant";

/* =======================================================
   🔵 NORMALIZER
======================================================= */
const normalizeArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.girls)) return res.girls;
  return [];
};

/* =======================================================
   🔵 GET ALL GIRLS
======================================================= */
export const getAllGirlsThunk = createAsyncThunk(
  "girls/getAll",
  async (_, { rejectWithValue, getState }) => {
    const { girls } = getState().girls;

    if (girls.length > 0) return girls;

    try {
      const res = await axiosInstance.get(GET_ALL_GIRLS_URL);
      return normalizeArray(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load girls");
    }
  }
);

/* =======================================================
   🔵 GET GIRLS BY CITY
======================================================= */
export const getGirlsByCityThunk = createAsyncThunk(
  "girls/getByCity",
  async (cityId, { rejectWithValue, getState }) => {
    const { cityGirlsById } = getState().girls;

    if (cityGirlsById[cityId]) {
      return { cityId, data: cityGirlsById[cityId] };
    }

    try {
      const res = await axiosInstance.get(
        `${GET_GIRLS_BY_CITY_URL}/${cityId}`
      );

      return {
        cityId,
        data: normalizeArray(res.data),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load city girls"
      );
    }
  }
);

/* =======================================================
   ⭐ GET GIRL BY ID (fallback only)
======================================================= */
export const getGirlByIdThunk = createAsyncThunk(
  "girls/getById",
  async (id, { rejectWithValue, getState }) => {
    const { singleGirlCache } = getState().girls;

    if (singleGirlCache[id]) return singleGirlCache[id];

    try {
      const res = await axiosInstance.get(`${GET_SINGLE_GIRL_URL}/${id}`);
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load girl"
      );
    }
  }
);

/* =======================================================
   🔥 GET GIRL BY SLUG (MAIN API)
======================================================= */
export const getGirlBySlugThunk = createAsyncThunk(
  "girls/getBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/girls/${slug}`
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load girl"
      );
    }
  }
);

/* =======================================================
   🟢 ADD GIRL
======================================================= */
export const addGirlThunk = createAsyncThunk(
  "girls/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(ADD_GIRL_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add girl");
    }
  }
);

/* =======================================================
   🔴 DELETE
======================================================= */
export const deleteGirlThunk = createAsyncThunk(
  "girls/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axiosInstance.delete(`${DELETE_GIRL_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete girl");
    }
  }
);

/* =======================================================
   🟡 UPDATE
======================================================= */
export const updateGirlThunk = createAsyncThunk(
  "girls/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axiosInstance.put(
        `${UPDATE_GIRL_URL}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update girl");
    }
  }
);

/* =======================================================
   🟣 STATUS
======================================================= */
export const toggleGirlStatusThunk = createAsyncThunk(
  "girls/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axiosInstance.patch(
        `${TOGGLE_GIRL_STATUS_URL}/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { id, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Status update failed");
    }
  }
);

/* =======================================================
   🎯 SLICE
======================================================= */
const girlSlice = createSlice({
  name: "girls",

  initialState: {
    girls: [],
    cityGirls: [],
    cityGirlsById: {},

    singleGirl: null,
    singleGirlCache: {},

    listLoading: false,
    cityLoading: false,
    singleLoading: false,

    error: null,
  },

  reducers: {
    resetGirlState: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ALL */
      .addCase(getAllGirlsThunk.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(getAllGirlsThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.girls = action.payload;
      })
      .addCase(getAllGirlsThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      /* CITY */
      .addCase(getGirlsByCityThunk.pending, (state) => {
        state.cityLoading = true;
      })
      .addCase(getGirlsByCityThunk.fulfilled, (state, action) => {
        state.cityLoading = false;
        state.cityGirls = action.payload.data;
        state.cityGirlsById[action.payload.cityId] = action.payload.data;
      })

      /* ⭐ SLUG */
      .addCase(getGirlBySlugThunk.pending, (state) => {
        state.singleLoading = true;
      })
      .addCase(getGirlBySlugThunk.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.singleGirl = action.payload;
        state.singleGirlCache[action.payload._id] = action.payload;
      })
      .addCase(getGirlBySlugThunk.rejected, (state, action) => {
        state.singleLoading = false;
        state.error = action.payload;
      })

      /* ID (fallback) */
      .addCase(getGirlByIdThunk.fulfilled, (state, action) => {
        state.singleGirl = action.payload;
        state.singleGirlCache[action.payload._id] = action.payload;
      })

      /* ADD */
      .addCase(addGirlThunk.fulfilled, (state, action) => {
        state.girls.unshift(action.payload);
      })

      /* DELETE */
      .addCase(deleteGirlThunk.fulfilled, (state, action) => {
        state.girls = state.girls.filter((g) => g._id !== action.payload);
      })

      /* UPDATE */
      .addCase(updateGirlThunk.fulfilled, (state, action) => {
        const updated = action.payload;

        state.girls = state.girls.map((g) =>
          g._id === updated._id ? updated : g
        );

        if (state.singleGirl?._id === updated._id) {
          state.singleGirl = updated;
        }

        state.singleGirlCache[updated._id] = updated;
      })

      /* STATUS */
      .addCase(toggleGirlStatusThunk.fulfilled, (state, action) => {
        const { id, status } = action.payload;

        state.girls = state.girls.map((g) =>
          g._id === id ? { ...g, status } : g
        );
      });
  },
});

export const { resetGirlState } = girlSlice.actions;
export default girlSlice.reducer;