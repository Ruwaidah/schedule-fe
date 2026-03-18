import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../features/auth/authSlice";

export default function AuthGate({ children }) {
    const dispatch = useDispatch();
    const { user, status } = useSelector((s) => s.auth);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token && !user && status === "idle") {
            dispatch(fetchMe());
        }
    }, [dispatch, token, user, status]);

    if (token && !user) {
        return (
            <div className="min-h-screen grid place-items-center bg-slate-50">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
                    Loading your account…
                </div>
            </div>
        );
    }

    return children;
}