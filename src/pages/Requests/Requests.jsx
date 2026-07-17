import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardHeader from "../Dashboard/DashboardHeader";
import { api } from "../../api/client";

import TimeOffRequestsTable from "./TimeOffRequestsTable";
import SwapRequestsTable from "./SwapRequestsTable";

function Tab({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition",
                active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

export default function Requests() {
    const user = useSelector((s) => s.auth.user);
    const storeId = user?.store_id;

    const [tab, setTab] = useState("timeoff"); // timeoff | swaps
    const [status, setStatus] = useState("pending");

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const [timeOff, setTimeOff] = useState([]);
    const [swaps, setSwaps] = useState([]);

    useEffect(() => {
        if (!user) return;

        const params =
            user.role_code === "ASSOCIATE"
                ? { status }
                : { store_id: storeId, status };

        setLoading(true);
        setErr(null);

        (async () => {
            try {
                const [toRes, swRes] = await Promise.all([
                    api.get("/api/time-off", { params }),
                    api.get("/api/swaps", { params }),
                ]);

                setTimeOff(toRes.data || []);
                setSwaps(swRes.data || []);
            } catch (e) {
                setErr("Failed to load requests.");
                setTimeOff([]);
                setSwaps([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [user, storeId, status]);

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardHeader />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Requests</h1>
                            <p className="mt-1 text-sm text-slate-600">Time off + shift swaps</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Tab active={tab === "timeoff"} onClick={() => setTab("timeoff")}>
                                Time Off
                            </Tab>
                            <Tab active={tab === "swaps"} onClick={() => setTab("swaps")}>
                                Swaps
                            </Tab>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="ml-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="denied">Denied</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                    </div>

                    {err ? (
                        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {err}
                        </div>
                    ) : null}

                    <div className="mt-6">
                        {tab === "timeoff" ? (
                            <TimeOffRequestsTable rows={timeOff} loading={loading} />
                        ) : (
                            <SwapRequestsTable rows={swaps} loading={loading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}