import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
import TodaySchedulePanel from "./TodaySchedulePanel";
import PendingRequestsPanel from "./PendingRequestsPanel";
import EmployeeOverviewPanel from "./EmployeeOverviewPanel";
import WeekStatusCard from "./WeekStatusCard";
import QuickActionsPanel from "./QuickActionsPanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <DashboardHeader />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12">
        <main className="lg:col-span-12">
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-600">
              Here’s a quick overview of activity in the system.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TodaySchedulePanel />
              <PendingRequestsPanel />
              <EmployeeOverviewPanel />
            </div>

            <div className="mt-6">
              <QuickActionsPanel />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <WeekStatusCard />
              <StatsGrid />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <TodaySchedulePanel />
            <PendingRequestsPanel />
            <EmployeeOverviewPanel />
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Scheduling App. Demo UI for portfolio.
          </p>
        </main>
      </div>
    </div>
  );
}