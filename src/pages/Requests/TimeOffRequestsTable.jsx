import StatusPill from "../../components/StatusPill";



export default function TimeOffRequestsTable({ rows = [], loading }) {

    const uniqueRequests = Array.from(
        new Map(
            rows.map((request) => [
                `${request.id}-${request.user_id}`,
                request,
            ])
        ).values()
    );
    if (loading) {
        return (
            <div className="space-y-3">
                <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
                <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
                <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No time off requests.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">Associate</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Dates</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Time</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Reason</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {uniqueRequests.map((r, index) => (
                        <tr key={`${r.id}-${r.user_id}-${r.start_date}-${index}`} className="border-t border-slate-200">
                            <td className="px-4 py-3 text-slate-900">
                                {r.first_name} {r.last_name}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                                {String(r.start_date).slice(0, 10)} → {String(r.end_date).slice(0, 10)}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                                {r.start_time && r.end_time
                                    ? `${String(r.start_time).slice(0, 5)}–${String(r.end_time).slice(0, 5)}`
                                    : "—"}
                            </td>
                            <td className="px-4 py-3 text-slate-700">{r.reason || "—"}</td>
                            <td className="px-4 py-3">
                                <StatusPill status={r.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}