import { useMemo } from "react";

function Pill({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default function PendingRequestsPanel() {
  const demo = useMemo(
    () => ({
      timeOff: 3,
      swaps: 2,
      items: [
        { id: "to-1", type: "Time Off", who: "Associate #12", when: "Mar 18", note: "Doctor appt" },
        { id: "to-2", type: "Time Off", who: "Associate #7", when: "Mar 20", note: "Family event" },
        { id: "sw-1", type: "Swap", who: "Associate #4", when: "Mar 22", note: "Swap with #9" },
        { id: "to-3", type: "Time Off", who: "Associate #18", when: "Mar 23", note: "Travel" },
        { id: "sw-2", type: "Swap", who: "Associate #2", when: "Mar 24", note: "Coverage needed" },
      ],
    }),
    []
  );

  const total = demo.timeOff + demo.swaps;

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Pending Requests</h3>
          <p className="mt-1 text-sm text-slate-600">Time off + swap requests</p>
        </div>
        <Pill>{total} pending</Pill>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">Time Off</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{demo.timeOff}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">Shift Swaps</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{demo.swaps}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-700">Latest</p>

        <ul className="mt-2 space-y-2">
          {demo.items.slice(0, 4).map((r) => (
            <li key={r.id} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{r.type}</p>
                <span className="text-xs font-medium text-slate-600">{r.when}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {r.who} • {r.note}
              </p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => alert("Wire this to /requests")}
        >
          Review requests
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          Demo panel (connect to API later).
        </p>
      </div>
    </section>
  );
}