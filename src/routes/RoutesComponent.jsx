// src/routes/RoutesComponent.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import RequireAuth from "./RequireAuth";


export default function RoutesComponent() {
    return (
        <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

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
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}