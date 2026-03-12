import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectWeekShifts, selectScheduleStatus } from "../../features/schedule/scheduleSlice";
import { getShiftHours } from "../../utils/hours";

export default function EmployeeOverviewPanel() {
  const shifts = useSelector(selectWeekShifts);
  const status = useSelector(selectScheduleStatus);
  const isLoading = status === "loading";

  const { top, unassignedCount, totalUsers } = useMemo(() => {
    const map = new Map();
    let unassigned = 0;

    for (const s of shifts) {
      if (!s.user_id) {
        unassigned += 1;
        continue;
      }
      const h = getShiftHours(s.start_time, s.end_time).paidHours;
      const cur = map.get(s.user_id) || { user_id: s.user_id, paidHours: 0, shifts: 0 };
      cur.paidHours += h;
      cur.shifts += 1;
      cur.first_name = s.first_name
      cur.last_name = s.last_name
      map.set(s.user_id, cur);
    }
    const arr = Array.from(map.values()).sort((a, b) => b.paidHours - a.paidHours);
    return {
      top: arr.slice(0, 5),
      unassignedCount: unassigned,
      totalUsers: arr.length,
    };
  }, [shifts]);

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Employee Overview</h3>
          <p className="mt-1 text-sm text-slate-600">Top hours this week</p>
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
          {isLoading ? "…" : `${totalUsers} associates`}
        </span>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
          </div>
        ) : top.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No assigned shifts this week yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {top.map((u) => (
              <li key={u.user_id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {u.first_name} {u.last_name}
                  </p>
                  <span className="text-xs font-semibold text-slate-700">
                    {u.paidHours.toFixed(1)} hrs
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{u.shifts} shifts</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Unassigned shifts: <span className="font-semibold">{unassignedCount}</span>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Uses current week schedule data.
      </p>
    </section>
  );
}