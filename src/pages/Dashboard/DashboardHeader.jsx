import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAssociate, isManager } from "../../utils/permissions";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function DashboardHeader() {
    const { user, status } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoadingUser = status === "loading" && !user;

    const firstName = user?.first_name || "User";
    const role = user?.role_code;

    const assoc = isAssociate(user);
    const manager = isManager(user);

    function navClass({ isActive }) {
        return [
            "rounded-lg px-2.5 py-1.5 text-sm font-semibold leading-none transition",
            isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        ].join(" ");
    }

    function handleLogout() {
        dispatch(logout());
        navigate("/login", { replace: true });
    }

    console.log(user)

    return (
        <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">                <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <span className="text-lg font-semibold">S</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">Scheduling App</p>
                    <p className="text-xs text-slate-500">{assoc ? "My Schedule" : "Dashboard"}</p>
                </div>
            </div>

                <nav className="ml-auto hidden items-center gap-2 md:flex">
                    <NavLink className={navClass} to="/dashboard">
                        Dashboard
                    </NavLink>

                    {/* Associates only */}
                    {assoc ? (
                        <>
                            <NavLink to="/my-schedule" end className={navClass}>
                                My Schedule
                            </NavLink>
                            <NavLink to="/requests" end className={navClass}>
                                My Requests
                            </NavLink>
                            <NavLink to="/profile" end className={navClass}>
                                Profile
                            </NavLink>
                        </>
                    ) : null}

                    {/* Managers */}
                    {manager ? (
                        <>
                            <NavLink to="/roster" end className={navClass}>
                                Weekly Roster
                            </NavLink>
                            <NavLink to="/requests" end className={navClass}>
                                Requests
                            </NavLink>
                            <NavLink to="/reports" end className={navClass}>
                                Reports
                            </NavLink>
                            <NavLink to="/profile" end className={navClass}>
                                Profile
                            </NavLink>
                        </>
                    ) : null}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 md:flex">
                        <div className="h-7 w-7 rounded-full bg-slate-200" />
                        {isLoadingUser ? "Loading..." : `Hello, ${firstName}${role ? ` (${role})` : ""}`}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}