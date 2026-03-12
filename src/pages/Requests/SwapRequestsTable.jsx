const demo = [
    { id: 1, requester: "Associate #4", shift: "Mar 22 09:00–17:00", note: "Swap with #9", status: "pending" },
    { id: 2, requester: "Associate #2", shift: "Mar 24 12:00–20:00", note: "Coverage needed", status: "pending" },
];

function StatusPill({ status }) {
    const base = "rounded-full border px-3 py-1 text-xs font-semibold";
    if (status === "approved") return <span className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>Approved</span>;
    if (status === "denied") return <span className={`${base} border-rose-200 bg-rose-50 text-rose-700`}>Denied</span>;
    return <span className={`${base} border-amber-200 bg-amber-50 text-amber-700`}>Pending</span>;
}

export default function SwapRequestsTable() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">Requester</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Shift</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Notes</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {demo.map((r) => (
                        <tr key={r.id} className="border-t border-slate-200 bg-white">
                            <td className="px-4 py-3 text-slate-900">{r.requester}</td>
                            <td className="px-4 py-3 text-slate-700">{r.shift}</td>
                            <td className="px-4 py-3 text-slate-700">{r.note}</td>
                            <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex gap-2">
                                    <button
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        onClick={() => alert("Approve (wire later)")}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                                        onClick={() => alert("Deny (wire later)")}
                                    >
                                        Deny
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Demo data — connect to /api/shift-swap-requests later.
            </div>
        </div>
    );
}