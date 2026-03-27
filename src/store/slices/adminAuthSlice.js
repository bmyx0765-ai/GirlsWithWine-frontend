import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInst/nce";
// import { LOGIN_ADMIN_URL } from "@/api/constant/constant";
import { axiosInstance } from "api/axiosInstance";
import { LOGIN_ADMIN_URL } from "api/constant/constant";

// Admin Login Thunk
export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(LOGIN_ADMIN_URL, {
        email,
        password,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Try again."
      );
    }
  }
);

const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState: {
    token: getLocalStorage("tokenId"),
    role: getLocalStorage("role"),
    loading: false,
    error: null,
  },

  reducers: {
    adminLogout: (state) => {
      state.token = null;
      state.role = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("tokenId");
        localStorage.removeItem("role");
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.role = action.payload.role;

        if (typeof window !== "undefined") {
          localStorage.setItem("tokenId", action.payload.token);
          localStorage.setItem("role", action.payload.role);
        }
      })

      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;