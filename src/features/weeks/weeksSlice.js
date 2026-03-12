import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchWeeks = createAsyncThunk("weeks/fetchWeeks", async ({ store_id }, thunkAPI) => {
    try {
        const res = await api.get("/api/schedule-weeks", { params: { store_id } });
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to load weeks");
    }
});

export const dropNextWeek = createAsyncThunk("weeks/dropNextWeek", async ({ store_id }, thunkAPI) => {
    try {
        const res = await api.post("/api/schedule-weeks/drop-next", null, { params: { store_id } });
        return res.data.week || null;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to drop next week");
    }
});

export const publishWeek = createAsyncThunk("weeks/publishWeek", async ({ id }, thunkAPI) => {
    try {
        const res = await api.post(`/api/schedule-weeks/${id}/publish`);
        return res.data.week;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to publish week");
    }
});

const weeksSlice = createSlice({
    name: "weeks",
    initialState: {
        items: [],
        status: "idle",
        error: null,
        actionStatus: "idle",
        actionError: null,
    },
    reducers: {
        clearWeeksActionError(state) {
            state.actionError = null;
            state.actionStatus = "idle";
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchWeeks.pending, (s) => { s.status = "loading"; s.error = null; })
            .addCase(fetchWeeks.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload || []; })
            .addCase(fetchWeeks.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })

            .addCase(dropNextWeek.pending, (s) => { s.actionStatus = "loading"; s.actionError = null; })
            .addCase(dropNextWeek.fulfilled, (s, a) => {
                s.actionStatus = "succeeded";
                if (a.payload) s.items = [...s.items, a.payload].sort((x, y) => String(x.week_start_date).localeCompare(String(y.week_start_date)));
            })
            .addCase(dropNextWeek.rejected, (s, a) => { s.actionStatus = "failed"; s.actionError = a.payload; })

            .addCase(publishWeek.pending, (s) => { s.actionStatus = "loading"; s.actionError = null; })
            .addCase(publishWeek.fulfilled, (s, a) => {
                s.actionStatus = "succeeded";
                const idx = s.items.findIndex(w => w.id === a.payload.id);
                if (idx >= 0) s.items[idx] = a.payload;
            })
            .addCase(publishWeek.rejected, (s, a) => { s.actionStatus = "failed"; s.actionError = a.payload; });
    },
});

export const { clearWeeksActionError } = weeksSlice.actions;
export default weeksSlice.reducer;


/**  Selectors */
export const selectWeeks = (s) => s.weeks.items;
export const selectWeeksStatus = (s) => s.weeks.status;
export const selectWeeksError = (s) => s.weeks.error;
export const selectWeeksActionStatus = (s) => s.weeks.actionStatus;
export const selectWeeksActionError = (s) => s.weeks.actionError;