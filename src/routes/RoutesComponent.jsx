import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound";
import RequireAuth from "./RequireAuth";
import WeeklySchedule from "../pages/WeeklySchedule/WeeklySchedule";
import WeeklyRoster from "../pages/Schedule/WeeklyRoster/WeeklyRoster";
import Requests from "../pages/Requests/Requests";


export default function RoutesComponent() {

    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/schedule"
                element={
                    <RequireAuth>
                        <WeeklySchedule />
                    </RequireAuth>
                }
            />

            <Route
                path="/roster"
                element={
                    <RequireAuth>
                        <WeeklyRoster />
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
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}