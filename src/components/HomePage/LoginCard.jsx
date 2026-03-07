import LoginForm from "./LoginForm";

export default function LoginCard() {
    return (
        <div className="flex items-center">
            <div className="w-full">
                <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-7 shadow-[0_18px_50px_-30px_rgba(15,23,42,.55)] backdrop-blur md:p-10">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />
                    <div className="flex items-center gap-3 pb-2 lg:hidden">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
                            <span className="text-lg font-semibold">S</span>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-slate-900">
                                Scheduling App
                            </p>
                            <p className="text-sm text-slate-600">Company sign-in</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Welcome back
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Log in with your company account.
                        </p>
                    </div>

                    <LoginForm />
                </div>

                <p className="mx-auto mt-4 max-w-lg text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Scheduling App. Demo UI for portfolio.
                </p>
            </div>
        </div>
    );
}