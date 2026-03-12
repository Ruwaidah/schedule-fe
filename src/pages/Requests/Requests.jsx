import { useState } from "react";
import DashboardHeader from "../Dashboard/DashboardHeader";
import TimeOffRequestsTable from "./TimeOffRequestsTable";
import SwapRequestsTable from "./SwapRequestsTable";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Requests() {
    const [tab, setTab] = useState("timeoff");

    return (
        <div className="min-h-screen bg-slate-50">
            <DashboardHeader />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Requests</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Review and manage time off and shift swap requests.
                            </p>
                        </div>

                        <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                            <button
                                type="button"
                                onClick={() => setTab("timeoff")}
                                className={cn(
                                    "rounded-2xl px-4 py-2 text-sm font-semibold transition",
                                    tab === "timeoff"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                Time Off
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab("swaps")}
                                className={cn(
                                    "rounded-2xl px-4 py-2 text-sm font-semibold transition",
                                    tab === "swaps"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                Shift Swaps
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        {tab === "timeoff" ? <TimeOffRequestsTable /> : <SwapRequestsTable />}
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Scheduling App. Demo UI for portfolio.
                </p>
            </div>
        </div>
    );
}