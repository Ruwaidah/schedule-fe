import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectWeekShifts, selectScheduleStatus } from "../../features/schedule/scheduleSlice";
import { selectEmployees } from "../../features/employees/employeesSlice";
import { getShiftHours } from "../../utils/hours";

export default function TopAssociatesReport() {
    const shifts = useSelector(selectWeekShifts);
    const status = useSelector(selectScheduleStatus);
    const employees = useSelector(selectEmployees);
    const isLoading = status === "loading";

    const rows = useMemo(() => {
        const nameMap = new Map(
            employees.map((e) => [String(e.id), `${e.first_name} ${e.last_name}`.trim()])
        );

        const map = new Map();
        for (const s of shifts) {
            if (!s.user_id) continue;
            const id = String(s.user_id);
            const paid = getShiftHours(s.start_time, s.end_time).paidHours;

            const cur = map.get(id) || { id, name: nameMap.get(id) || `User #${id}`, paidHours: 0, shifts: 0 };
            cur.paidHours += paid;
            cur.shifts += 1;
            map.set(id, cur);
        }

        return Array.from(map.values()).sort((a, b) => b.paidHours - a.paidHours).slice(0, 10);
    }, [shifts, employees]);

    return (
        <section className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6">
            <h2 className="text-base font-semibold text-slate-900">Top Associates</h2>
            <p className="mt-1 text-sm text-slate-600">Top 10 by paid hours this week</p>

            <div className="mt-4">
                {isLoading ? (
                    <div className="space-y-3">
                        <div className="h-10 rounded-2xl bg-white animate-pulse" />
                        <div className="h-10 rounded-2xl bg-white animate-pulse" />
                        <div className="h-10 rounded-2xl bg-white animate-pulse" />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        No assigned shifts yet.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Associate</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Shifts</th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Paid Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id} className="border-t border-slate-200">
                                        <td className="px-4 py-3 text-slate-900">{r.name}</td>
                                        <td className="px-4 py-3 text-slate-700">{r.shifts}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                            {r.paidHours.toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}