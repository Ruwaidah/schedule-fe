import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchEmployees = createAsyncThunk(
    "employees/fetchEmployees",
    async ({ store_id }, thunkAPI) => {
        try {
            const res = await api.get("/api/users", { params: { store_id } });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to load employees");
        }
    }
);

const employeesSlice = createSlice({
    name: "employees",
    initialState: { items: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchEmployees.pending, (s) => { s.status = "loading"; s.error = null; })
            .addCase(fetchEmployees.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload || []; })
            .addCase(fetchEmployees.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
    },
});

export default employeesSlice.reducer;
export const selectEmployees = (s) => s.employees.items;