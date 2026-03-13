import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../../api/client";

function Pill({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default function PendingRequestsPanel() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const storeId = user?.store_id;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [timeOffPending, setTimeOffPending] = useState(0);
  const [swapPending, setSwapPending] = useState(0);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const params = storeId ? { store_id: storeId } : {};
        const res = await api.get("/api/requests/summary", { params });
        setTimeOffPending(Number(res.data?.timeOffPending || 0));
        setSwapPending(Number(res.data?.swapPending || 0));
        setLatest(res.data?.latest || []);
      } catch (e) {
        setErr("Failed to load pending requests.");
        setTimeOffPending(0);
        setSwapPending(0);
        setLatest([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, storeId]);

  const total = timeOffPending + swapPending;

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Pending Requests
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Time off + swap requests
          </p>
        </div>
        <Pill>{loading ? "…" : `${total} pending`}</Pill>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {err}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">Time Off</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading ? "…" : timeOffPending}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">Shift Swaps</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading ? "…" : swapPending}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-700">Latest</p>

        {loading ? (
          <div className="mt-2 space-y-2">
            <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
          </div>
        ) : latest.length === 0 ? (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No pending requests.
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {latest.slice(0, 4).map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {r.type}
                  </p>
                  <span className="text-xs font-medium text-slate-600">
                    {r.when}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {r.who} • {r.note}
                </p>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => navigate("/requests")}
        >
          Review requests
        </button>
      </div>
    </section>
  );
}