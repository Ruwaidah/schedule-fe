import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchDepartments = createAsyncThunk(
    "departments/fetchDepartments",
    async ({ store_id }, thunkAPI) => {
        try {
            const res = await api.get("/api/departments", { params: { store_id } });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err?.response?.data?.message || "Failed to load departments"
            );
        }
    }
);

const departmentsSlice = createSlice({
    name: "departments",
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to load departments";
            });
    },
});

export default departmentsSlice.reducer;

export const selectDepartments = (state) => state.departments.items;
export const selectDepartmentsStatus = (state) => state.departments.status;
export const selectDepartmentsError = (state) => state.departments.error;