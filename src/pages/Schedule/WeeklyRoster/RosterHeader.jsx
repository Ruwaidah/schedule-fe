export default function RosterHeader({
  start_date,
  end_date,
  viewingWeekOffset,
  departmentId,
  setDepartmentId,
  departments,
  anchorDate,
  setAnchorDate,
  onPrevWeek,
  onNextWeek,
  isLoading,
  weekStatus
}) {

  function badgeClass(status) {
    if (status === "published") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (status === "draft") return "border-amber-200 bg-amber-50 text-amber-700";
    if (status === "locked") return "border-slate-200 bg-slate-100 text-slate-700";
    return "border-slate-200 bg-white text-slate-600";
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Weekly Roster</h1>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(weekStatus)}`}>
            {`Status: ${weekStatus}`}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {start_date} → {end_date} (Sat–Fri)
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Auto-managed every Saturday (current + next 2 published, week 3 draft).
        </p>
        {viewingWeekOffset < 0 ? (
          <p className="mt-1 text-xs text-slate-500">Past week (view only)</p>
        ) : viewingWeekOffset > 3 ? (
          <p className="mt-1 text-xs text-slate-500">Future week (locked)</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-56 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Week of</label>
          <input
            type="date"
            value={anchorDate}
            onChange={(e) => setAnchorDate(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
          />
        </div>

        <button
          onClick={onPrevWeek}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          disabled={isLoading}
        >
          Previous week
        </button>

        <button
          onClick={onNextWeek}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          disabled={isLoading}
        >
          Next week
        </button>
      </div>
    </div>
  );
}