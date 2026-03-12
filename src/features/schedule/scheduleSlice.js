import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchWeekSchedule = createAsyncThunk(
    "schedule/fetchWeekSchedule",
    async (params, thunkAPI) => {
        try {
            const res = await api.get("/api/schedule/week", { params });
            return res.data.shifts || [];
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to load schedule");
        }
    }
);

export const createShift = createAsyncThunk(
    "schedule/createShift",
    async (payload, thunkAPI) => {
        try {
            const res = await api.post("/api/shifts", payload);
            return res.data.shift;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err?.response?.data?.message || "Failed to create shift"
            );
        }
    }
);

export const updateShift = createAsyncThunk(
    "schedule/updateShift",
    async ({ shiftId, patch }, thunkAPI) => {
        try {
            const res = await api.patch(`/api/shifts/${shiftId}`, patch);
            return res.data.shift;
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to update shift");
        }
    }
);

export const deleteShift = createAsyncThunk(
    "schedule/deleteShift",
    async ({ shiftId }, thunkAPI) => {
        try {
            await api.delete(`/api/shifts/${shiftId}`);
            return { shiftId };
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to delete shift");
        }
    }
);

const scheduleSlice = createSlice({
    name: "schedule",
    initialState: {
        shifts: [],
        status: "idle",
        error: null,
        saving: false,
        saveError: null,
    },
    reducers: {
        clearScheduleErrors(state) {
            state.error = null;
            state.saveError = null;
        },
    },
    extraReducers: (b) => {
        b
            .addCase(fetchWeekSchedule.pending, (s) => {
                s.status = "loading";
                s.error = null;
            })
            .addCase(fetchWeekSchedule.fulfilled, (s, a) => {
                s.status = "succeeded";
                s.shifts = a.payload;
            })
            .addCase(fetchWeekSchedule.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.payload;
            })

            .addCase(createShift.pending, (s) => {
                s.saving = true;
                s.saveError = null;
            })
            .addCase(createShift.fulfilled, (s) => {
                s.saving = false;
            })
            .addCase(createShift.rejected, (s, a) => {
                s.saving = false;
                s.saveError = a.payload;
            })

            .addCase(updateShift.pending, (s) => {
                s.saving = true;
                s.saveError = null;
            })
            .addCase(updateShift.fulfilled, (s, a) => {
                s.saving = false;
                const idx = s.shifts.findIndex((x) => x.id === a.payload.id);
                if (idx >= 0) s.shifts[idx] = { ...s.shifts[idx], ...a.payload };
            })
            .addCase(updateShift.rejected, (s, a) => {
                s.saving = false;
                s.saveError = a.payload;
            })

            .addCase(deleteShift.pending, (s) => {
                s.saving = true;
                s.saveError = null;
            })
            .addCase(deleteShift.fulfilled, (s) => {
                s.saving = false;
            })
            .addCase(deleteShift.rejected, (s, a) => {
                s.saving = false;
                s.saveError = a.payload;
            });
    },
});

export const { clearScheduleErrors } = scheduleSlice.actions;
export default scheduleSlice.reducer;

export const selectWeekShifts = (s) => s.schedule.shifts;
export const selectScheduleStatus = (s) => s.schedule.status;
export const selectScheduleError = (s) => s.schedule.error;
export const selectScheduleSaving = (s) => s.schedule.saving;
export const selectScheduleSaveError = (s) => s.schedule.saveError;