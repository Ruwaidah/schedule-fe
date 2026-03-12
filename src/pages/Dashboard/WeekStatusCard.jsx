import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../api/client";
import { fetchWeekSchedule, selectWeekShifts, selectScheduleStatus } from "../../features/schedule/scheduleSlice";
import { addDays, startOfWeekSaturday, toYYYYMMDD } from "../../utils/date";
import { getShiftHours } from "../../utils/hours";
import BudgetEditModal from "./BudgetEditModal";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

function StatLine({ label, value, sub }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
            {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
        </div>
    );
}

function nextSaturdayLabel() {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7;
    const nextSat = new Date(d);
    nextSat.setDate(d.getDate() + diff);
    nextSat.setHours(0, 0, 0, 0);
    return nextSat.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function WeekStatusCard() {
    const dispatch = useDispatch();

    const authUser = useSelector((s) => s.auth.user);
    const storeId = authUser?.store_id;

    const shifts = useSelector(selectWeekShifts);
    const shiftsStatus = useSelector(selectScheduleStatus);

    const [weekRow, setWeekRow] = useState(null);
    const [weekLoading, setWeekLoading] = useState(false);
    const [weekError, setWeekError] = useState(null);

    const [openBudget, setOpenBudget] = useState(false);
    const [budgetSaving, setBudgetSaving] = useState(false);
    const [budgetError, setBudgetError] = useState(null);

    const weekStart = useMemo(() => startOfWeekSaturday(new Date()), []);
    const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
    const start_date = useMemo(() => toYYYYMMDD(weekStart), [weekStart]);
    const end_date = useMemo(() => toYYYYMMDD(weekEnd), [weekEnd]);

    async function loadWeekRow() {
        if (!storeId) return;
        setWeekLoading(true);
        setWeekError(null);
        try {
            const res = await api.get("/api/schedule-weeks", { params: { store_id: storeId } });
            const weeks = res.data || [];
            const w = weeks.find((x) => String(x.week_start_date).slice(0, 10) === start_date);
            setWeekRow(w || null);
        } catch (e) {
            setWeekError("Could not load week status.");
            setWeekRow(null);
        } finally {
            setWeekLoading(false);
        }
    }

    useEffect(() => {
        loadWeekRow();
    }, [storeId, start_date]);

    useEffect(() => {
        if (!storeId) return;
        dispatch(fetchWeekSchedule({ store_id: storeId, start_date, end_date }));
    }, [dispatch, storeId, start_date, end_date]);

    const { paidHours, totalHours, shiftCount } = useMemo(() => {
        let paid = 0;
        let total = 0;
        for (const s of shifts) {
            const h = getShiftHours(s.start_time, s.end_time);
            paid += h.paidHours;
            total += h.totalHours;
        }
        return { paidHours: paid, totalHours: total, shiftCount: shifts.length };
    }, [shifts]);

    const weekStatus = weekRow?.status || (weekLoading ? "…" : "unknown");
    const budget = weekRow?.total_hours_budget != null ? Number(weekRow.total_hours_budget) : null;
    const budgetDelta = budget == null ? null : paidHours - budget;

    const budgetLocked = weekLoading || !weekRow || weekStatus === "locked";

    async function handleSaveBudget(values) {
        if (!weekRow?.id) return;

        setBudgetSaving(true);
        setBudgetError(null);
        try {
            const res = await api.patch(`/api/schedule-weeks/${weekRow.id}`, {
                total_hours_budget: Number(values.total_hours_budget),
            });

            setWeekRow(res.data?.week || { ...weekRow, total_hours_budget: Number(values.total_hours_budget) });

            setOpenBudget(false);
        } catch (e) {
            setBudgetError("Failed to save budget.");
        } finally {
            setBudgetSaving(false);
        }
    }

    return (
        <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">This Week</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        {start_date} → {end_date} (Sat–Fri)
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs font-semibold",
                            weekStatus === "published"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : weekStatus === "draft"
                                    ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : weekStatus === "locked"
                                        ? "border-slate-200 bg-slate-100 text-slate-700"
                                        : "border-slate-200 bg-white text-slate-600"
                        )}
                        title={weekError || ""}
                    >
                        {weekLoading ? "Loading…" : `Status: ${weekStatus}`}
                    </span>

                    <button
                        type="button"
                        disabled={budgetLocked}
                        onClick={() => {
                            setBudgetError(null);
                            setOpenBudget(true);
                        }}
                        className={cn(
                            "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
                            budgetLocked
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        Edit budget
                    </button>
                </div>
            </div>

            {weekError ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {weekError}
                </div>
            ) : null}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatLine
                    label="Scheduled hours (paid)"
                    value={shiftsStatus === "loading" ? "…" : paidHours.toFixed(1)}
                    sub={shiftsStatus === "loading" ? "Loading shifts…" : `${shiftCount} shifts`}
                />

                <StatLine
                    label="Hours budget (store)"
                    value={budget == null ? "—" : budget.toFixed(1)}
                    sub={
                        budget == null
                            ? "Set in schedule_weeks.total_hours_budget"
                            : budgetDelta == null
                                ? ""
                                : `${budgetDelta >= 0 ? "+" : ""}${budgetDelta.toFixed(1)} vs budget`
                    }
                />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                        Total hours (incl. lunch):{" "}
                        <span className="font-semibold">{shiftsStatus === "loading" ? "…" : totalHours.toFixed(1)}</span>
                    </span>
                    <span className="text-xs text-slate-500">Next week drop: {nextSaturdayLabel()}</span>
                </div>
            </div>

            {budgetError ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {budgetError}
                </div>
            ) : null}

            <BudgetEditModal
                open={openBudget}
                onClose={() => setOpenBudget(false)}
                week={weekRow}
                onSave={handleSaveBudget}
                saving={budgetSaving}
            />
        </section>
    );
}