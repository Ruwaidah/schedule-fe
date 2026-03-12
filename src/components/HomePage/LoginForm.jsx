import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../features/auth/authSlice";

import IconEye from "../IconEye";
import IconLock from "../IconLock";
import IconMail from "../IconMail";
import Field from "./Field";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const { status, error } = useSelector((state) => state.auth);
  const isLoggingIn = status === "loading";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: true },
  });

  const remember = watch("remember");
  const canSubmit = useMemo(() => isValid && !isLoggingIn, [isValid, isLoggingIn]);
  console.log(status)

  async function onSubmit(values) {
    try {
      const from = location.state?.from?.pathname || "/dashboard";
      await dispatch(login(values)).unwrap();
      navigate(from, { replace: true });
    } catch (errMsg) {
      console.log("Login failed:", errMsg);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-slate-400">
            <IconMail className="h-5 w-5" />
          </span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...register("email", {
              required: "Email is required.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
            })}
            className={cn(
              "w-full rounded-2xl border bg-white/90 px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400",
              errors.email
                ? "border-rose-300 ring-4 ring-rose-100"
                : "border-slate-200/80 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
            )}
          />
        </div>
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-slate-400">
            <IconLock className="h-5 w-5" />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 6, message: "Password must be at least 6 characters." },
            })}
            className={cn(
              "w-full rounded-2xl border bg-white/90 px-10 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400",
              errors.password
                ? "border-rose-300 ring-4 ring-rose-100"
                : "border-slate-200/80 hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
            )}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-2 grid w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-200/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <IconEye open={showPassword} className="h-5 w-5" />
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            {...register("remember")}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 transition focus:ring-4 focus:ring-blue-200/50"
          />
          Remember me
        </label>

        <button
          type="button"
          className="text-sm font-medium text-blue-700 transition hover:text-blue-800 hover:underline"
          onClick={() => alert("Hook this to /forgot-password")}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-200/60",
          canSubmit
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 shadow-md"
            : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
        )}
      >
        {isLoggingIn ? "Signing in..." : "Log in"}
      </button>

      <p className="pt-2 text-center text-xs text-slate-500">
        Only authorized company users can access this system.
      </p>
    </form>
  );
}