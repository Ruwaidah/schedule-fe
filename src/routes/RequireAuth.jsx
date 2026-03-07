import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const isAuthed = Boolean(token && user);


    if (!isAuthed) return <Navigate to="/login" replace />;
    return children;
}
