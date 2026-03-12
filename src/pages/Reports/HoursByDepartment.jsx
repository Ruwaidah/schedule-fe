import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectWeekShifts, selectScheduleStatus } from "../../features/schedule/scheduleSlice";
import { selectDepartments } from "../../features/departments/departmentsSlice";
import { getShiftHours } from "../../utils/hours";

export default function HoursByDepartment() {
    const shifts = useSelector(selectWeekShifts);
    const status = useSelector(selectScheduleStatus);
    const departments = useSelector(selectDepartments);
    const isLoading = status === "loading";

    const rows = useMemo(() => {
        const deptName = new Map(departments.map((d) => [String(d.id), d.name]));
        const map = new Map();

        for (const s of shifts) {
            const id = String(s.department_id);
            const name = deptName.get(id) || `Dept #${id}`;
            const paid = getShiftHours(s.start_time, s.end_time).paidHours;

            const cur = map.get(id) || { id, name, paidHours: 0, shifts: 0 };
            cur.paidHours += paid;
            cur.shifts += 1;
            map.set(id, cur);
        }

        return Array.from(map.values()).sort((a, b) => b.paidHours - a.paidHours);
    }, [shifts, departments]);

    return (
        <section className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6">
            <h2 className="text-base font-semibold text-slate-900">Hours by Department</h2>
            <p className="mt-1 text-sm text-slate-600">Paid hours scheduled this week</p>

            <div className="mt-4">
                {isLoading ? (
                    <div className="space-y-3">
                        <div className="h-10 rounded-2xl bg-white animate-pulse" />
                        <div className="h-10 rounded-2xl bg-white animate-pulse" />
                        <div className="h-10 rounded-2xl bg-white animate-pulse" />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        No shift data yet.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Department</th>
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