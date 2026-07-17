import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import shiftsReducer from "../features/shifts/shiftsSlice";
import departmentsReducer from "../features/departments/departmentsSlice"
import weeksReducer from "../features/weeks/weeksSlice"
import scheduleReducer from "../features/schedule/scheduleSlice";
import employeesReducer from "../features/employees/employeesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shifts: shiftsReducer,
    departments: departmentsReducer,
    weeks: weeksReducer,
    schedule: scheduleReducer,
    employees: employeesReducer,
  },
});
