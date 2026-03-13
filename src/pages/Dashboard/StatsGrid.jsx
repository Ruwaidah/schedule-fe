import { useDispatch, useSelector } from "react-redux";
import { selectShifts, selectShiftsStatus, fetchShifts } from "../../features/shifts/shiftsSlice";
import { useMemo, useEffect, useState } from "react";
import { startOfWeekSaturday, addDays } from "../WeeklySchedule/WeeklySchedule";
import { toYYYYMMDD } from "../../utils/date";
import StatCard from "./StatCard";
import { api } from "../../api/client";

export default function StatsGrid() {
    const dispatch = useDispatch();
    const shifts = useSelector(selectShifts);
    const shiftsStatus = useSelector(selectShiftsStatus);

    const user = useSelector((s) => s.auth.user);
    const storeId = user?.store_id;

    const isLoadingShifts = shiftsStatus === "loading";
    const isReady = Boolean(storeId);

    const today = useMemo(() => new Date(), []);
    const todayKey = useMemo(() => toYYYYMMDD(today), [today]);

    const weekStart = useMemo(() => startOfWeekSaturday(today), [today]);
    const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

    const start_date = useMemo(() => toYYYYMMDD(weekStart), [weekStart]);
    const end_date = useMemo(() => toYYYYMMDD(weekEnd), [weekEnd]);

    const [confLoading, setConfLoading] = useState(false);
    const [confError, setConfError] = useState(null);
    const [confCount, setConfCount] = useState(null);

    function toDateKey(val) {
        const s = String(val);
        if (s.length >= 10 && s[4] === "-" && s[7] === "-") return s.slice(0, 10);
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? s.slice(0, 10) : toYYYYMMDD(d);
    }

    useEffect(() => {
        if (!user) return;

        setConfLoading(true);
        setConfError(null);

        (async () => {
            try {
                const params = {
                    start_date,
                    end_date,
                    ...(storeId ? { store_id: storeId } : {}), // managers need store_id
                };

                const res = await api.get("/api/shifts/conflicts", { params });
                setConfCount(Number(res.data?.count ?? 0));
            } catch (e) {
                setConfError("Failed to load");
                setConfCount(null);
            } finally {
                setConfLoading(false);
            }
        })();
    }, [user, storeId, start_date, end_date]);

    // fetch shifts
    useEffect(() => {
        if (!storeId) return;
        dispatch(fetchShifts({ store_id: storeId, start_date, end_date }));
    }, [dispatch, storeId, start_date, end_date]);

    const shiftsToday = useMemo(
        () => shifts.filter((s) => toDateKey(s.shift_date) === todayKey),
        [shifts, todayKey]
    );

    // ---- pending requests ----
    const [reqLoading, setReqLoading] = useState(false);
    const [reqError, setReqError] = useState(null);
    const [pendingTotal, setPendingTotal] = useState(null);

    useEffect(() => {
        if (!user) return;

        setReqLoading(true);
        setReqError(null);

        (async () => {
            try {
                const params = storeId ? { store_id: storeId } : {};
                const res = await api.get("/api/requests/summary", { params });

                const timeOff = Number(res.data?.timeOffPending || 0);
                const swaps = Number(res.data?.swapPending || 0);
                setPendingTotal(timeOff + swaps);
            } catch (e) {
                setReqError("Failed to load");
                setPendingTotal(null);
            } finally {
                setReqLoading(false);
            }
        })();
    }, [user, storeId]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Shifts This Week"
                value={!isReady ? "…" : isLoadingShifts ? "…" : shifts.length}
                hint={`${start_date} → ${end_date}`}
            />
            <StatCard
                title="Shifts Today"
                value={!isReady ? "…" : isLoadingShifts ? "…" : shiftsToday.length}
                hint={todayKey}
            />
            <StatCard
                title="Pending Requests"
                value={!user ? "…" : reqLoading ? "…" : pendingTotal ?? "—"}
                hint={reqError ? reqError : "Time off + swaps"}
            />
            <StatCard
                title="Shift Conflicts"
                value={!user ? "…" : confLoading ? "…" : confCount ?? "—"}
                hint={confError ? confError : "Overlapping shifts"}
            />
        </div>
    );
}