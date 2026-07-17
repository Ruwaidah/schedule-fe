import { Navigate } from "react-router-dom";

export default function RequireRole({ allow, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Demo visitors can view every portfolio page
  if (user?.is_demo) {
    return children;
  }

  if (!user?.role_code || !allow.includes(user.role_code)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}