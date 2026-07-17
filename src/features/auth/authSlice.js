import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

const tokenFromStorage = localStorage.getItem("token");

const userFromStorage = (() => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
})();

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Login failed"
      );
    }
  }
);

// CURRENT USER
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/auth/me");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Session expired"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: userFromStorage,
    token: tokenFromStorage || null,
    status: "idle",
    error: null,
  },

  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;
      state.status = "succeeded";
      state.error = null;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("demoMode");
    },

    setToken(state, action) {
      state.token = action.payload;

      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },

    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;

        state.status = "succeeded";
        state.user = user || null;
        state.token = token;
        state.error = null;

        // Normal login should remove demo mode.
        localStorage.removeItem("demoMode");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })

      // FETCH CURRENT USER
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;

        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
      })

      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        state.error = action.payload || "Session expired";

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("demoMode");
      });
  },
});

export const {
  logout,
  setToken,
  setCredentials,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;