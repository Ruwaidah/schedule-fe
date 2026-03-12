import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

function buildParams(params) {
  const clean = {};
  Object.entries(params || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") clean[key] = val;
  });
  return clean;
}

export const fetchShifts = createAsyncThunk(
  "shifts/fetchShifts",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/api/shifts", {
        params: buildParams(params),
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load shifts"
      );
    }
  }
);


// create shift
export const createShift = createAsyncThunk("shifts/createShift", async (payload, thunkAPI) => {
  try {
    console.log(payload)
    const res = await api.post("/api/shifts", payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to create shift"
    );
  }
})

const shiftsSlice = createSlice({
  name: "shifts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    createStatus: "idle",
    createError: null,
  },
  reducers: {
    clearShiftsError(state) {
      state.error = null;
    },
    clearShifts(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    clearCreateShiftError(state) {
      state.createError = null;
      state.createStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      //  fetch
      .addCase(fetchShifts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load shifts";
      })

      //  create
      .addCase(createShift.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createShift.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createShift.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create shift";
      });
  },
});

export const { clearShiftsError, clearShifts, clearCreateShiftError } = shiftsSlice.actions;
export default shiftsSlice.reducer;

/**  Selectors */
export const selectShifts = (state) => state.shifts.items;
export const selectShiftsStatus = (state) => state.shifts.status;
export const selectShiftsError = (state) => state.shifts.error;

export const selectCreateShiftStatus = (state) => state.shifts.createStatus;
export const selectCreateShiftError = (state) => state.shifts.createError;