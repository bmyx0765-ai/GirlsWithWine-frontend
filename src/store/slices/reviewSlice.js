"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "api/axiosInstance";
import { CREATE_REVIEW_URL, DELETE_REVIEW_URL , REJECT_REVIEW_URL , GET_ALL_REVIEWS_URL ,GET_TOP_REVIEWS_URL , GET_REVIEW_BY_GIRL_ID ,APPROVE_REVIEW_URL ,  } from "api/constant/constant";


// ============================
// THUNKS
// ============================

// CREATE REVIEW
export const createReviewThunk = createAsyncThunk(
  "review/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        CREATE_REVIEW_URL,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 🔥 MUST ADD
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET ALL REVIEWS
export const getAllReviewsThunk = createAsyncThunk(
  "review/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_ALL_REVIEWS_URL);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET TOP REVIEWS
export const getTopReviewsThunk = createAsyncThunk(
  "review/getTop",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_TOP_REVIEWS_URL);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET REVIEWS BY GIRL ID
export const getReviewsByGirlThunk = createAsyncThunk(
  "review/getByGirl",
  async (id, { rejectWithValue }) => {
    try {
      const url = GET_REVIEW_BY_GIRL_ID.replace(":id", id);
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// APPROVE REVIEW
export const approveReviewThunk = createAsyncThunk(
  "review/approve",
  async (id, { rejectWithValue }) => {
    try {
      const url = APPROVE_REVIEW_URL.replace(":id", id);
      await axiosInstance.patch(url);
      return id; // ✅ simplified
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// REJECT REVIEW
export const rejectReviewThunk = createAsyncThunk(
  "review/reject",
  async (id, { rejectWithValue }) => {
    try {
      const url = REJECT_REVIEW_URL.replace(":id", id);
      await axiosInstance.patch(url);
      return id; // ✅ simplified
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// DELETE REVIEW
export const deleteReviewThunk = createAsyncThunk(
  "review/delete",
  async (id, { rejectWithValue }) => {
    try {
      const url = DELETE_REVIEW_URL.replace(":id", id);
      await axiosInstance.delete(url);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============================
// SLICE
// ============================

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    topReviews: [],
    girlReviews: [],
    loading: false,
    error: null,
    success: false
  },

  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },

  extraReducers: (builder) => {

    // CREATE
    builder
      .addCase(createReviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET ALL
    builder
      .addCase(getAllReviewsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET TOP
    builder.addCase(getTopReviewsThunk.fulfilled, (state, action) => {
      state.topReviews = action.payload;
    });

    // GET BY GIRL
    builder.addCase(getReviewsByGirlThunk.fulfilled, (state, action) => {
      state.girlReviews = action.payload;
    });

    // APPROVE
    builder.addCase(approveReviewThunk.fulfilled, (state, action) => {
      const review = state.reviews.find((r) => r._id === action.payload);
      if (review) review.status = "Approved";
    });

    // REJECT
    builder.addCase(rejectReviewThunk.fulfilled, (state, action) => {
      const review = state.reviews.find((r) => r._id === action.payload);
      if (review) review.status = "Rejected";
    });

    // DELETE
    builder.addCase(deleteReviewThunk.fulfilled, (state, action) => {
      state.reviews = state.reviews.filter(
        (r) => r._id !== action.payload
      );
    });
  }
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;