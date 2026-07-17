import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
    const location = useLocation();

    const token = localStorage.getItem("token");
    const isDemoMode = localStorage.getItem("demoMode") === "true";

    const hasAccess = Boolean(token) || isDemoMode;

    if (!hasAccess) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}