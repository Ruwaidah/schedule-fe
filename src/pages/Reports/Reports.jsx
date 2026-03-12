import DashboardHeader from "../Dashboard/DashboardHeader";
import HoursByDepartment from "./HoursByDepartment";
import TopAssociatesReport from "./TopAssociatesReport";

export default function Reports() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-600">
            Weekly insights based on scheduled shifts.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <HoursByDepartment />
            <TopAssociatesReport />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Scheduling App. Demo UI for portfolio.
        </p>
      </div>
    </div>
  );
}