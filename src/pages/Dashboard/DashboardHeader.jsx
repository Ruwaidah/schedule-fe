import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashboardHeader() {
    const { user, status } = useSelector(state => state.auth)
    const isLoadingUser = status === "loading" && !user;
    const firstName = user?.first_name || "User";
    const lastName = user?.last_name || "";

    console.log(user)

    return (
        <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
                        <span className="text-lg font-semibold">S</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Scheduling App</p>
                        <p className="text-xs text-slate-500">Dashboard</p>
                    </div>
                </div>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link className="text-sm font-medium text-blue-700" to="/dashboard">
                        Dashboard
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" to="/schedule">
                        Schedule
                    </Link>
                    <Link
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        to="/roster"
                    >
                        Weekly Roster
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" to="/requests">
                        Requests
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" to="/reports">
                        Reports
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <button className="relative rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Notifications
                        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-xs font-semibold text-white">
                            5
                        </span>
                    </button>

                    <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 md:flex">
                        <div className="h-7 w-7 rounded-full bg-slate-200" />
                        {isLoadingUser ? "Loading..." : `Hello, ${firstName}`}
                    </div>
                </div>
            </div>
        </header>
    );
}