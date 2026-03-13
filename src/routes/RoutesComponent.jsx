import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound";
import RequireAuth from "./RequireAuth";
import WeeklyRoster from "../pages/Schedule/WeeklyRoster/WeeklyRoster";
import Requests from "../pages/Requests/Requests";
import RequireRole from "./RequireRole";
import MySchedule from "../pages/MySchedule/MySchedule";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";


export default function RoutesComponent() {

    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route
                path="/my-schedule"
                element={
                    <RequireAuth>
                        <RequireRole allow={["ASSOCIATE"]}>
                            <MySchedule />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            <Route
                path="/roster"
                element={
                    <RequireAuth>
                        <RequireRole allow={["ADMIN", "HR", "COACH", "TEAM_LEAD"]}>
                            <WeeklyRoster />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            <Route
                path="/reports"
                element={
                    <RequireAuth>
                        <RequireRole allow={["ADMIN", "HR", "COACH", "TEAM_LEAD"]}>
                            <Reports />
                        </RequireRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />

            <Route
                path="/requests"
                element={
                    <RequireAuth>
                        <Requests />
                    </RequireAuth>
                }
            />

            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <Profile />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}