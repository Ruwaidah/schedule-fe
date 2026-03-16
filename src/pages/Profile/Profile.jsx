import { useSelector } from "react-redux";
import DashboardHeader from "../Dashboard/DashboardHeader";

function Field({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{value || "—"}</p>
        </div>
    );
}

export default function Profile() {
    const user = useSelector((s) => s.auth.user);

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardHeader />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Your account details.
                            </p>
                        </div>

                        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="First name" value={user?.first_name} />
                        <Field label="Last name" value={user?.last_name} />
                        <Field label="Email" value={user?.email} />
                        <Field label="Role" value={user?.role_code} />
                        <Field label="Store ID" value={user?.store_id ? String(user.store_id) : ""} />
                        <Field label="Status" value={user?.status} />
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Security</p>
                        <p className="mt-1 text-sm text-slate-600">
                            Password change is not implemented in this demo yet.
                        </p>

                        <button
                            type="button"
                            className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Change password
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Scheduling App. Demo UI for portfolio.
                </p>
            </div>
        </div>
    );
}