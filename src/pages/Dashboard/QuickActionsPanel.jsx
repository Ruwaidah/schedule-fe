import { useNavigate } from "react-router-dom";

export default function QuickActionsPanel() {
    const nav = useNavigate();

    const Btn = ({ label, to }) => (
        <button
            type="button"
            onClick={() => nav(to)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
            {label}
        </button>
    );

    return (
        <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
            <p className="mt-1 text-sm text-slate-600">Jump to common tasks</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Btn label="Open Weekly Roster" to="/roster" />
                <Btn label="Open Schedule" to="/schedule" />
                <Btn label="View Requests" to="/requests" />
                <Btn label="View Reports" to="/reports" />
            </div>
        </section>
    );
}