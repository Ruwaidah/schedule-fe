import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireRole({ allow, children }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;

  const ok = allow.includes(user.role_code);
  if (!ok) return <Navigate to="/dashboard" replace />;

  return children;
}