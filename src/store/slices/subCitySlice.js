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



// ================= CREATE =================
export const createSubCity = createAsyncThunk(
  "subCity/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        ADD_SUBCITY_URL,
        formData,
        true
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= GET ALL =================
export const fetchSubCities = createAsyncThunk(
  "subCity/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_SUBCITIES_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= GET BY CITY =================
export const fetchSubCitiesByCity = createAsyncThunk(
  "subCity/fetchByCity",
  async (cityId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${GET_SUBCITIES_BY_CITY_URL}/${cityId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= GET BY ID =================
export const fetchSubCityById = createAsyncThunk(
  "subCity/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${GET_SUBCITY_BY_ID_URL}/${id}`,
        true
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= UPDATE =================
export const updateSubCity = createAsyncThunk(
  "subCity/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `${UPDATE_SUBCITY_URL}/${id}`,
        formData,
        true
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= DELETE =================
export const deleteSubCity = createAsyncThunk(
  "subCity/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${DELETE_SUBCITY_URL}/${id}`,
        true
      );
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= STATUS =================
export const toggleSubCityStatus = createAsyncThunk(
  "subCity/status",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `${SUBCITY_STATUS_URL}/${id}`,
        {},
        true
      );
      return { id, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= SLICE =================
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

    // CREATE
    builder.addCase(createSubCity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSubCity.fulfilled, (state, action) => {
      state.loading = false;
      state.subCities.unshift(action.payload.data);
    });
    builder.addCase(createSubCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });


    // GET ALL
    builder.addCase(fetchSubCities.fulfilled, (state, action) => {
      state.subCities = action.payload;
    });


    // GET BY CITY
    builder.addCase(fetchSubCitiesByCity.fulfilled, (state, action) => {
      state.subCities = action.payload;
    });


    // GET BY ID
    builder.addCase(fetchSubCityById.fulfilled, (state, action) => {
      state.selectedSubCity = action.payload;
    });


    // UPDATE
    builder.addCase(updateSubCity.fulfilled, (state, action) => {
      const index = state.subCities.findIndex(
        item => item._id === action.payload.data._id
      );
      if (index !== -1) {
        state.subCities[index] = action.payload.data;
      }
    });


    // DELETE
    builder.addCase(deleteSubCity.fulfilled, (state, action) => {
      state.subCities = state.subCities.filter(
        item => item._id !== action.payload
      );
    });


    // STATUS
    builder.addCase(toggleSubCityStatus.fulfilled, (state, action) => {
      const item = state.subCities.find(
        i => i._id === action.payload.id
      );
      if (item) {
        item.status = action.payload.status;
      }
    });
  }
});

export const { clearSubCity } = subCitySlice.actions;
export default subCitySlice.reducer;