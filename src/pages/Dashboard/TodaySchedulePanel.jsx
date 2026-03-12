import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectWeekShifts, selectScheduleStatus } from "../../features/schedule/scheduleSlice";
import { toYYYYMMDD } from "../../utils/date";


function dateKey(val) {
  if (!val) return "";
  const s = String(val);
  if (s.length >= 10 && s[4] === "-" && s[7] === "-") return s.slice(0, 10);
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? "" : toYYYYMMDD(d);
}

function timeKey(t) {
  return String(t || "00:00").slice(0, 5);
}

export default function TodaySchedulePanel() {
  const shifts = useSelector(selectWeekShifts);
  const status = useSelector(selectScheduleStatus);
  const isLoading = status === "loading";

  const todayKey = useMemo(() => toYYYYMMDD(new Date()), []);

  const todayShifts = useMemo(() => {
    const list = shifts
      .filter((s) => dateKey(s.shift_date) === todayKey)
      .slice()
      .sort((a, b) => timeKey(a.start_time).localeCompare(timeKey(b.start_time)));

    return list;
  }, [shifts, todayKey]);

  console.log(todayShifts)

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Today’s Schedule</h3>
          <p className="mt-1 text-sm text-slate-600">{todayKey}</p>
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
          {isLoading ? "…" : `${todayShifts.length} shifts`}
        </span>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-2xl bg-slate-100 animate-pulse" />
          </div>
        ) : todayShifts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No shifts scheduled for today.
          </div>
        ) : (
          <ul className="space-y-2">
            {todayShifts.map((s) => (
              <li key={s.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {String(s.start_time).slice(0, 5)}–{String(s.end_time).slice(0, 5)}
                  </p>
                  <span className="text-xs font-medium text-slate-600">
                    Dept #{s.department_id}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  {s.user_id ? `${s.first_name} ${s.last_name}` : "Unassigned"} • {s.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Uses current week schedule data.
      </p>
    </section>
  );
}