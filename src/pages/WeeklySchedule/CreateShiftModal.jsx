import { useEffect } from "react";
import { useForm } from "react-hook-form";

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreateShiftModal({
    open,
    onClose,
    canCreate,
    defaultDate,
    defaultUserId,
    employees = [],
    departments = [],
    allowedDepartments = [],
    saving,
    saveError,
    onCreate,
    weekStatus,
    getShiftHours,
}) {
    const departmentOptions =
        allowedDepartments.length > 0 ? allowedDepartments : departments;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        clearErrors,
        formState: { isValid, errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            shift_date: defaultDate || "",
            user_id: defaultUserId ? String(defaultUserId) : "",
            department_id: "",
            start_time: "09:00",
            end_time: "17:00",
            status: weekStatus || "draft",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                shift_date: defaultDate || "",
                user_id: defaultUserId ? String(defaultUserId) : "",
                department_id: "",
                start_time: "09:00",
                end_time: "17:00",
                status: weekStatus || "draft",
            });
            clearErrors();
        }
    }, [open, defaultDate, defaultUserId, weekStatus, reset, clearErrors]);

    if (!open) return null;

    const isDisabled = !canCreate || saving;

    const isSaving = saving;
    const watchedStart = watch("start_time");
    const watchedEnd = watch("end_time");
    const hoursInfo = getShiftHours
        ? getShiftHours(watchedStart, watchedEnd)
        : null;

    async function submit(values) {
        if (!canCreate) return;
        await onCreate(values);
    }

    return (
        <div className="fixed inset-0 z-50">
            <button
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
                aria-label="Close"
            />

            <div className="relative mx-auto mt-24 w-[92%] max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Create Shift</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Add a shift to the weekly schedule.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
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
                    <input type="hidden" value={defaultDate || ""} {...register("shift_date")} />
                    <input type="hidden" value={defaultUserId ? String(defaultUserId) : ""} {...register("user_id")} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Date</label>
                            <input
                                type="date"
                                {...register("shift_date", { required: "Date required" })}
                                disabled={isDisabled || Boolean(defaultDate)}
                                className={cn(
                                    "w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-4",
                                    isDisabled || defaultDate
                                        ? "border-slate-200 bg-slate-100 text-slate-500"
                                        : "border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-200/50"
                                )}
                            />
                            {defaultDate ? (
                                <p className="text-xs text-slate-500">Date locked from roster day.</p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-slate-600">
                                Week status: <span className="font-semibold text-slate-900">{weekStatus}</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">Associate</label>
                        <select
                            {...register("user_id", { required: "Associate required" })}
                            disabled={isDisabled || Boolean(defaultUserId)}
                            className={cn(
                                "w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4",
                                isDisabled || defaultUserId
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-white focus:border-blue-400 focus:ring-blue-200/50"
                            )}
                        >
                            <option value="">Select…</option>
                            {employees.map((u) => (
                                <option key={u.id} value={String(u.id)}>
                                    {u.first_name} {u.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">Department</label>
                        <select
                            {...register("department_id", { required: "Department is required" })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
                        >
                            <option value="">Select department…</option>
                            {departmentOptions.map((d) => (
                                <option key={d.id} value={String(d.id)}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id ? (
                            <p className="text-xs text-rose-600">{errors.department_id.message}</p>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Start time</label>
                            <input
                                type="time"
                                {...register("start_time", { required: "Start time required" })}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
                            />
                            {errors.start_time ? (
                                <p className="text-xs text-rose-600">{errors.start_time.message}</p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">End time</label>
                            <input
                                type="time"
                                {...register("end_time", { required: "End time required" })}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50"
                            />
                            {errors.end_time ? (
                                <p className="text-xs text-rose-600">{errors.end_time.message}</p>
                            ) : null}
                        </div>
                    </div>

                    {hoursInfo ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            {hoursInfo.totalHours.toFixed(1)}h total
                            {hoursInfo.lunchHours > 0 ? ` • ${hoursInfo.lunchHours}h lunch` : ""}
                            {` • ${hoursInfo.paidHours.toFixed(1)}h paid`}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={!isValid || isSaving || !canCreate}
                        className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-200/60 ${!isValid || isSaving || !canCreate
                            ? "cursor-not-allowed bg-slate-300"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800"
                            }`}
                    >
                        {isSaving ? "Creating..." : "Create shift"}
                    </button>
                </form>
            </div>
        </div>
    );
}