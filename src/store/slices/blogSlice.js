"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "api/axiosInstance";

import {
  CREATE_BLOG_URL,
  GET_ALL_BLOGS_URL,
  GET_BLOG_BY_SLUG_URL,
  UPDATE_BLOG_URL,
  DELETE_BLOG_URL
} from "api/constant/constant";

// ============================
// THUNKS
// ============================

// CREATE BLOG
export const createBlogThunk = createAsyncThunk(
  "blog/create",
  async (data, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("tokenId")
          : null;

      const res = await axiosInstance.post(
        CREATE_BLOG_URL,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data", // ✅ override here
          },
        }
      );

      return res.data;
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET ALL BLOGS
export const getAllBlogsThunk = createAsyncThunk(
  "blog/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(GET_ALL_BLOGS_URL);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET BLOG BY SLUG
export const getBlogBySlugThunk = createAsyncThunk(
  "blog/getBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const url = GET_BLOG_BY_SLUG_URL.replace(":slug", slug);
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE BLOG
export const updateBlogThunk = createAsyncThunk(
  "blog/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const url = UPDATE_BLOG_URL.replace(":id", id);
      const res = await axiosInstance.put(url, data); // or patch
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// DELETE BLOG
export const deleteBlogThunk = createAsyncThunk(
  "blog/delete",
  async (id, { rejectWithValue }) => {
    try {
      const url = DELETE_BLOG_URL.replace(":id", id);
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

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    singleBlog: null,
    loading: false,
    error: null,
    success: false
  },

  reducers: {
    resetBlogState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },

  extraReducers: (builder) => {

    // CREATE
    builder
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET ALL
    builder
      .addCase(getAllBlogsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBlogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET BY SLUG
    builder
      .addCase(getBlogBySlugThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogBySlugThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBlog = action.payload;
      })
      .addCase(getBlogBySlugThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder.addCase(updateBlogThunk.fulfilled, (state, action) => {
      state.success = true;

      const index = state.blogs.findIndex(
        (b) => b._id === action.payload._id
      );

      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    });

    // DELETE
    builder.addCase(deleteBlogThunk.fulfilled, (state, action) => {
      state.blogs = state.blogs.filter(
        (b) => b._id !== action.payload
      );
    });
  }
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;