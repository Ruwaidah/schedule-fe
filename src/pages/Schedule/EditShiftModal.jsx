import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

function toMinutes(hhmm) {
    const [h, m] = String(hhmm).slice(0, 5).split(":").map(Number);
    return h * 60 + m;
}
function toHHMM(mins) {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
}
function calcLunchRange(startTime, endTime) {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    const duration = end - start;

    if (duration < 6 * 60) return null; // no lunch
    const lunchStart = start + 4 * 60;
    const lunchEnd = lunchStart + 60;
    if (lunchEnd > end) return null;

    return { lunchStart: toHHMM(lunchStart), lunchEnd: toHHMM(lunchEnd) };
}

export default function EditShiftModal({
    open,
    onClose,
    canEdit,
    canDelete,
    shift,
    departments = [],
    employees = [],
    saving,
    saveError,
    onUpdateShift,
    onDeleteShift,
    getShiftHours,
}) {


    const defaultValues = useMemo(() => {
        if (!shift) return null;
        return {
            shift_date: String(shift.shift_date).slice(0, 10),
            department_id: shift.department_id ? String(shift.department_id) : "",
            start_time: String(shift.start_time).slice(0, 5),
            end_time: String(shift.end_time).slice(0, 5),
            user_id: shift.user_id ? String(shift.user_id) : "",
            status: shift.status || "draft",
        };
    }, [shift]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { isValid, isDirty },
    } = useForm({ mode: "onChange", defaultValues: defaultValues || {} });

    useEffect(() => {
        if (open && defaultValues) reset(defaultValues);
    }, [open, defaultValues, reset]);



    if (!open || !shift) return null;

    const isDisabled = !canEdit || saving;
    const watchedStart = watch("start_time") || String(shift.start_time).slice(0, 5);
    const watchedEnd = watch("end_time") || String(shift.end_time).slice(0, 5);
    const lunch = calcLunchRange(watchedStart, watchedEnd);

    const hoursInfo = getShiftHours
        ? getShiftHours(watchedStart, watchedEnd)
        : { totalHours: 0, lunchHours: 0, paidHours: 0 };

    async function submit(values) {
        if (!canEdit) return;

        const patch = {
            department_id: Number(values.department_id),
            start_time: values.start_time,
            end_time: values.end_time,
            user_id: values.user_id ? Number(values.user_id) : null,
        };

        await onUpdateShift({ shiftId: shift.id, patch });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50">
            <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Close" />

            <div className="relative mx-auto mt-20 w-[92%] max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            {canEdit ? "Edit Shift" : "View Shift"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Shift #{shift.id} • {String(shift.shift_date).slice(0, 10)}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            reset(defaultValues);
                            onClose();
                        }}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>

                {saveError ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {saveError}
                    </div>
                ) : null}

                <form className="mt-5 space-y-4" onSubmit={handleSubmit(submit)}>
                    <input type="hidden" value={String(shift.shift_date).slice(0, 10)} {...register("shift_date")} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Date</label>
                            <input
                                type="date"
                                {...register("shift_date")}
                                disabled={true}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 outline-none"
                            />
                            <p className="text-xs text-slate-500">Date is locked for this shift.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Status</label>
                            <p className="text-xs text-slate-600">
                                Set by week:{" "}
                                <span className="font-semibold text-slate-900">{shift.status}</span>
                            </p>
                            <input type="hidden" value={shift.status} {...register("status")} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">Department</label>
                        <select
                            {...register("department_id")}
                            disabled={isDisabled || departments.length === 0}
                            className={cn(
                                "w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-4",
                                isDisabled || departments.length === 0
                                    ? "border-slate-200 bg-slate-100 text-slate-500"
                                    : "border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-200/50"
                            )}
                        >
                            <option value="">Select department…</option>
                            {departments.map((d) => (
                                <option key={d.id} value={String(d.id)}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        {departments.length === 0 ? (
                            <p className="text-xs text-rose-600">
                                No allowed departments for this associate.
                            </p>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Start</label>
                            <input
                                type="time"
                                {...register("start_time")}
                                disabled={isDisabled}
                                className={cn(
                                    "w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-4",
                                    isDisabled
                                        ? "border-slate-200 bg-slate-100 text-slate-500"
                                        : "border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-200/50"
                                )}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">End</label>
                            <input
                                type="time"
                                {...register("end_time")}
                                disabled={isDisabled}
                                className={cn(
                                    "w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-4",
                                    isDisabled
                                        ? "border-slate-200 bg-slate-100 text-slate-500"
                                        : "border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-200/50"
                                )}
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        {hoursInfo.totalHours.toFixed(1)}h total
                        {hoursInfo.lunchHours > 0 ? ` • ${hoursInfo.lunchHours}h lunch` : ""}
                        {` • ${hoursInfo.paidHours.toFixed(1)}h paid`}

                        {lunch ? (
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                                <span aria-hidden>🍽️</span>
                                <span>Lunch {lunch.lunchStart}–{lunch.lunchEnd}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">Assigned associate</label>

                        {/*  lock user on edit so departments stay valid */}
                        <select
                            {...register("user_id")}
                            disabled={true}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600"
                        >
                            <option value="">Unassigned</option>
                            {employees.map((u) => (
                                <option key={u.id} value={String(u.id)}>
                                    {u.first_name} {u.last_name}
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-slate-500">
                            To reassign, delete and create a new shift (keeps department rules clean).
                        </p>
                    </div>

                    {canEdit ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                disabled={!isDirty || saving}
                                onClick={() => { reset(defaultValues); onClose() }}
                                className={cn(
                                    "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                    !isDirty || saving
                                        ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                Discard changes
                            </button>

                            <button
                                type="submit"
                                disabled={saving || !isValid || !isDirty}
                                className={cn(
                                    "w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-200/60",
                                    saving || !isValid || !isDirty
                                        ? "cursor-not-allowed bg-slate-300"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                )}
                            >
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-xs text-slate-500">View only — you can’t edit this week.</p>
                    )}

                    {canEdit && canDelete ? (
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                                const ok = confirm("Delete this shift? This cannot be undone.");
                                if (ok) onDeleteShift({ shiftId: shift.id });
                            }}
                            className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                        >
                            Delete shift
                        </button>
                    ) : null}
                </form>
            </div>
        </div>
    );
}