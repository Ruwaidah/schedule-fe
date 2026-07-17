import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../api/client";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: { email: "" },
    });

    async function onSubmit(values) {
        setServerError(null);
        // try {
        //     await api.post("/api/auth/forgot-password", { email: values.email });

        //     setSent(true);
        //     setTimeout(() => navigate("/login", { replace: true }), 1500);
        // } catch (err) {
        //     setSent(true);
        // }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-200/40 blur-3xl" />
                <div className="absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
                <div className="w-full rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_18px_50px_-30px_rgba(15,23,42,.55)] backdrop-blur md:p-10">
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
                            <span className="text-lg font-semibold">S</span>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-slate-900">Scheduling App</p>
                            <p className="text-sm text-slate-600">Company account support</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Enter your company email. If an account exists, we’ll send reset instructions.
                        </p>
                    </div>

                    {serverError ? (
                        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {serverError}
                        </div>
                    ) : null}

                    {sent ? (
                        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            If that email exists, reset instructions were sent. Redirecting to login…
                        </div>
                    ) : (
                        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">Company Email</label>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Enter a valid email address.",
                                        },
                                    })}
                                    className={cn(
                                        "w-full rounded-2xl border bg-white px-3 py-3 text-sm text-slate-900 outline-none transition",
                                        "placeholder:text-slate-400",
                                        errors.email
                                            ? "border-rose-300 ring-4 ring-rose-100"
                                            : "border-slate-200/80 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
                                    )}
                                />
                                {errors.email ? (
                                    <p className="text-xs font-medium text-rose-600">{errors.email.message}</p>
                                ) : null}
                            </div>
                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className={cn(
                                    "w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition",
                                    "focus:outline-none focus:ring-4 focus:ring-blue-200/60",
                                    !isValid || isSubmitting
                                        ? "cursor-not-allowed bg-slate-300"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                )}
                            >
                                {isSubmitting ? "Sending..." : "Send reset link"}
                            </button>

                            <div className="flex items-center justify-between pt-2">
                                <NavLink
                                    to="/login"
                                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 hover:underline">
                                    Back to login
                                </NavLink>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}