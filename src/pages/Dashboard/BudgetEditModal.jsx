import { useEffect } from "react";
import { useForm } from "react-hook-form";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function BudgetEditModal({ open, onClose, week, onSave, saving }) {
    const { register, handleSubmit, reset, formState: { isValid } } = useForm({
        mode: "onChange",
        defaultValues: { total_hours_budget: "" },
    });

    useEffect(() => {
        if (!open) return;
        reset({ total_hours_budget: week?.total_hours_budget ?? "" });
    }, [open, week, reset]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Close" />

            <div className="relative mx-auto mt-24 w-[92%] max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Edit Weekly Budget</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            {week ? `${String(week.week_start_date).slice(0, 10)} → ${String(week.week_end_date).slice(0, 10)}` : ""}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>

                <form
                    className="mt-5 space-y-4"
                    onSubmit={handleSubmit((values) => onSave(values))}
                >
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">Total hours budget</label>
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            {...register("total_hours_budget", { required: true })}
                            className={cn(
                                "w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-4",
                                "border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-200/50"
                            )}
                        />
                        <p className="text-xs text-slate-500">Example: 920</p>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || saving}
                        className={cn(
                            "w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition",
                            !isValid || saving
                                ? "cursor-not-allowed bg-slate-300"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        )}
                    >
                        {saving ? "Saving..." : "Save budget"}
                    </button>
                </form>
            </div>
        </div>
    );
}