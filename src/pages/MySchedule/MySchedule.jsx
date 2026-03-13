import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "../Dashboard/DashboardHeader";
import { fetchWeekSchedule, selectWeekShifts, selectScheduleStatus } from "../../features/schedule/scheduleSlice";
import { addDays, startOfWeekSaturday, toYYYYMMDD } from "../../utils/date";

function dateKey(val) {
    const s = String(val || "");
    return s.length >= 10 ? s.slice(0, 10) : s;
}

export default function MySchedule() {
    const dispatch = useDispatch();
    const user = useSelector((s) => s.auth.user);
    const storeId = user?.store_id;

    const shifts = useSelector(selectWeekShifts);
    const status = useSelector(selectScheduleStatus);
    const isLoading = status === "loading";

    const [anchorDate, setAnchorDate] = useState(() => toYYYYMMDD(new Date()));

    const weekStart = useMemo(() => startOfWeekSaturday(new Date(anchorDate)), [anchorDate]);
    const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
    const start_date = useMemo(() => toYYYYMMDD(weekStart), [weekStart]);
    const end_date = useMemo(() => toYYYYMMDD(weekEnd), [weekEnd]);

    useEffect(() => {
        if (!storeId) return;
        dispatch(fetchWeekSchedule({ store_id: storeId, start_date, end_date }));
    }, [dispatch, storeId, start_date, end_date]);

    const myShifts = useMemo(() => {
        const uid = user?.id;
        return shifts
            .filter((s) => !uid || String(s.user_id) === String(uid))
            .slice()
            .sort((a, b) => dateKey(a.shift_date).localeCompare(dateKey(b.shift_date)));
    }, [shifts, user?.id]);

    const days = useMemo(
        () => Array.from({ length: 7 }).map((_, i) => toYYYYMMDD(addDays(weekStart, i))),
        [weekStart]
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardHeader />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">My Schedule</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                {start_date} → {end_date} (Sat–Fri)
                            </p>
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
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
                                onClick={() => setAnchorDate(toYYYYMMDD(addDays(weekStart, -7)))}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Previous week
                            </button>

                            <button
                                onClick={() => setAnchorDate(toYYYYMMDD(addDays(weekStart, 7)))}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Next week
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
                        {days.map((d) => {
                            const items = myShifts.filter((s) => dateKey(s.shift_date) === d);
                            return (
                                <div key={d} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-slate-700">
                                            {new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })}
                                        </p>
                                        <p className="text-[11px] text-slate-500">{d}</p>
                                    </div>

                                    {isLoading ? (
                                        <div className="mt-2 h-10 rounded-xl bg-white animate-pulse" />
                                    ) : items.length === 0 ? (
                                        <p className="mt-2 text-xs text-slate-600">—</p>
                                    ) : (
                                        <div className="mt-2 space-y-2">
                                            {items.map((s) => (
                                                <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-2">
                                                    <p className="text-xs font-semibold text-slate-900">
                                                        {String(s.start_time).slice(0, 5)}–{String(s.end_time).slice(0, 5)}
                                                    </p>
                                                    <p className="text-[11px] text-slate-600">Dept #{s.department_id} • {s.status}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}