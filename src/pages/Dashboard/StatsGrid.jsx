import { useDispatch, useSelector } from "react-redux";
import { selectShifts, selectShiftsStatus, selectShiftsError, fetchShifts } from "../../features/shifts/shiftsSlice";
import { useMemo, useEffect } from "react";
import {startOfWeekSaturday, addDays } from "../WeeklySchedule/WeeklySchedule";
import { toYYYYMMDD } from "../../utils/date";
import StatCard from "./StatCard";

export default function StatsGrid() {
    const dispatch = useDispatch();
    const shifts = useSelector(selectShifts);
    const status = useSelector(selectShiftsStatus);

    const user = useSelector((s) => s.auth.user);
    const storeId = user?.store_id;

    const isLoading = status === "loading";
    const isReady = Boolean(storeId);

    const today = useMemo(() => new Date(), []);
    const todayKey = useMemo(() => toYYYYMMDD(today), [today]);

    const weekStart = useMemo(() => startOfWeekSaturday(today), [today]);
    const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

    const start_date = useMemo(() => toYYYYMMDD(weekStart), [weekStart]);
    const end_date = useMemo(() => toYYYYMMDD(weekEnd), [weekEnd]);

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

    useEffect(() => {
        if (!storeId) return;
        dispatch(fetchShifts({ store_id: storeId, start_date, end_date }));
    }, [dispatch, storeId, start_date, end_date]);

    const shiftsToday = useMemo(
        () => shifts.filter((s) => toDateKey(s.shift_date) === todayKey),
        [shifts, todayKey]
    );

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Shifts This Week"
                value={!isReady ? "…" : isLoading ? "…" : shifts.length}
                hint={`${start_date} → ${end_date}`}
            />
            <StatCard
                title="Shifts Today"
                value={!isReady ? "…" : isLoading ? "…" : shiftsToday.length}
                hint={todayKey}
            />
            <StatCard title="Pending Requests" value="5" hint="Demo (wire later)" />
            <StatCard title="Shift Conflicts" value="0" hint="Demo (wire later)" />
        </div>
    );
}