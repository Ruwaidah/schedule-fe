import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, selectDepartments } from "../../features/departments/departmentsSlice";
import {
    createShift, fetchShifts, selectShifts,
    selectShiftsStatus, selectShiftsError,
    selectCreateShiftStatus, selectCreateShiftError,
    clearCreateShiftError
} from "../../features/shifts/shiftsSlice";
import { selectWeeks } from "../../features/weeks/weeksSlice";
import CreateShiftModal from "./CreateShiftModal";
import { toYYYYMMDD } from "../../utils/date";

export function startOfWeekSaturday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 1) % 7;

    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

export default function WeeklySchedule() {
    const dispatch = useDispatch();
    const departments = useSelector(selectDepartments);
    const shifts = useSelector(selectShifts);
    const status = useSelector(selectShiftsStatus);
    const error = useSelector(selectShiftsError);

    const [storeId, setStoreId] = useState("1");
    const [openCreate, setOpenCreate] = useState(false);
    const [anchorDate, setAnchorDate] = useState(() => toYYYYMMDD(new Date()));
    const [departmentId, setDepartmentId] = useState(""); // "" = All departments

    const weekStart = useMemo(() => startOfWeekSaturday(new Date(anchorDate)), [anchorDate]);
    const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

    const start_date = useMemo(() => toYYYYMMDD(weekStart), [weekStart]);
    const end_date = useMemo(() => toYYYYMMDD(weekEnd), [weekEnd]);

    const weeks = useSelector(selectWeeks);
    const currentWeek = useMemo(() => {
        const start = start_date;
        return weeks.find(w => String(w.week_start_date).slice(0, 10) === start) || null;
    }, [weeks, start_date]);

    useEffect(() => {
        if (!storeId) return;
        dispatch(fetchShifts({ store_id: storeId, start_date, end_date, ...(departmentId ? { department_id: departmentId } : {}) }));
    }, [dispatch, storeId, start_date, end_date, departmentId]);

    useEffect(() => {
        if (!storeId) return;
        dispatch(fetchDepartments({ store_id: storeId }));
    }, [dispatch, storeId]);

    const isLoading = status === "loading";

    function diffHours(start, end) {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;
        const mins = Math.max(0, endMin - startMin);
        return mins / 60;
    }

    const scheduledHours = useMemo(() => {
        return shifts.reduce((sum, s) => sum + diffHours(s.start_time, s.end_time), 0);
    }, [shifts]);

    const budget = Number(currentWeek?.total_hours_budget || 0);
    const remaining = Math.max(0, budget - scheduledHours);

    function toDateKey(val) {
        const d = new Date(val);
        if (!Number.isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        }
        return String(val).slice(0, 10);
    }

    const groupedByDay = useMemo(() => {
        const map = new Map();
        for (const s of shifts) {
            const key = toDateKey(s.shift_date);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(s);
        }
        return map;
    }, [shifts]);

    async function refetchWeek() {
        if (!storeId) return;
        await dispatch(
            fetchWeekSchedule({
                store_id: storeId,
                start_date,
                end_date,
                ...(departmentId ? { department_id: departmentId } : {}),
            })
        );
    }


    async function handleCreateShift(values) {
        const today = toYYYYMMDD(new Date());

        if (values.shift_date < today) {
            throw new Error("You can only create shifts for today or future dates.");
        }

        const payload = {
            store_id: storeId,
            user_id: values.user_id ? Number(values.user_id) : null,
            department_id: Number(values.department_id),
            shift_date: values.shift_date,
            start_time: values.start_time,
            end_time: values.end_time,
            status: values.status,
        };

        await dispatch(createShift(payload)).unwrap();
        await refetchWeek();
        setOpenCreate(false);
    }


    function prevWeek() {
        setAnchorDate(toYYYYMMDD(addDays(weekEnd, -7)));
    }
    function nextWeek() {
        setAnchorDate(toYYYYMMDD(addDays(weekEnd, 7)));
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Store Weekly Schedule</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            {start_date} → {end_date}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Store</label>
                            <input
                                value={storeId}
                                onChange={(e) => setStoreId(e.target.value)}
                                className="w-28 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
                            />
                        </div>

                        {/* Department */}
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
                            onClick={prevWeek}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            disabled={isLoading}
                        >
                            Previous week
                        </button>

                        <button
                            onClick={nextWeek}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            disabled={isLoading}
                        >
                            Next week
                        </button>
                    </div>
                    <button
                        onClick={() => setOpenCreate(true)}
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                    >
                        Create Shift
                    </button>
                </div>

                {error ? (
                    <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">
                            Shifts ({shifts.length})
                        </h2>
                        {isLoading ? <span className="text-xs text-slate-500">Loading…</span> : null}
                    </div>

                    <div className="mt-4 space-y-4">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const day = addDays(weekStart, i);
                            const key = toYYYYMMDD(day);
                            const dayShifts = groupedByDay.get(key) || [];

                            return (
                                <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-900">{key}</p>
                                        <p className="text-xs text-slate-600">{dayShifts.length} shifts</p>
                                    </div>

                                    {dayShifts.length === 0 ? (
                                        <p className="mt-2 text-sm text-slate-600">No shifts</p>
                                    ) : (
                                        <ul className="mt-3 space-y-2">
                                            {dayShifts.map((s) => (
                                                <li
                                                    key={s.id}
                                                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {s.start_time} – {s.end_time}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-600">
                                                            Dept #{s.department_id} • Shift #{s.id} • {s.status}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <CreateShiftModal
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onSubmit={handleCreateShift}
                    departments={departments}
                    defaultDate={anchorDate}
                    selectCreateShiftStatus={selectCreateShiftStatus}
                    selectCreateShiftError={selectCreateShiftError}
                    clearError={() => dispatch(clearCreateShiftError())}
                />
            </div>
        </div>
    );
}