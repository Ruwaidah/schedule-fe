import loginBg from "../assets/bg.png";
import LoginCard from "../components/HomePage/LoginCard";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-300/25 blur-3xl" />
                <div className="absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full bg-indigo-300/20 blur-3xl" />
                <div className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-300/18 blur-3xl" />
            </div>
            <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
                <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                    {/* Left side */}
                    <div className="hidden lg:flex">
                        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 shadow-[0_18px_50px_-30px_rgba(15,23,42,.55)] backdrop-blur">
                            <div className="flex items-center gap-3 px-10 pt-10">
                                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
                                    <span className="text-lg font-semibold">S</span>
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-slate-900">
                                        Scheduling App
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Company account sign-in
                                    </p>
                                </div>
                            </div>
                            <div className="px-10 pb-8 pt-8">
                                <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                                    Keep scheduling simple and organized.
                                </h1>
                                <p className="mt-3 text-slate-600">
                                    Sign in with your company credentials to view schedules, request
                                    time off, and manage coverage.
                                </p>
                            </div>
                            <div className="relative mx-8 mb-10 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
                                <img
                                    src={loginBg}
                                    alt="Scheduling app illustration"
                                    className="h-[420px] w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />
                            </div>
                        </div>
                    </div>

                    {/* Right side login card */}
                    <LoginCard />
                </div>
            </div>
        </div>
    );
}