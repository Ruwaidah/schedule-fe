import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../api/client";
import { setCredentials } from "../features/auth/authSlice";

export default function DemoPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const hasOpenedDemo = useRef(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (hasOpenedDemo.current) return;

        hasOpenedDemo.current = true;

        async function openDemo() {
            try {
                setError("");

                // Clear any old session first
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("demoMode");

                const response = await api.post("/api/auth/demo");

                const { token, user } = response.data;

                if (!token || !user) {
                    throw new Error("Invalid demo response.");
                }

                // Demo mode
                localStorage.setItem("demoMode", "true");

                // Update Redux and localStorage immediately
                dispatch(
                    setCredentials({
                        token,
                        user,
                    })
                );

                navigate("/dashboard", { replace: true });
            } catch (err) {
                console.error("Demo login failed:", err);

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "The demo could not be opened."
                );
            }
        }

        openDemo();
    }, [dispatch, navigate]);

    const tryAgain = () => {
        hasOpenedDemo.current = false;
        setError("");
        window.location.reload();
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm text-center">
                {error ? (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M12 9v4"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M12 17h.01"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M10.3 3.3h3.4L22 21H2L10.3 3.3Z"
                                    strokeWidth="1.6"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h1 className="mt-4 text-xl font-semibold text-slate-900">
                            Demo unavailable
                        </h1>

                        <p className="mt-2 text-sm text-rose-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={tryAgain}
                            className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login", { replace: true })}
                            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Return to Login
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <h1 className="mt-4 text-xl font-semibold text-slate-900">
                            Opening portfolio demo
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Loading the scheduling dashboard...
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}