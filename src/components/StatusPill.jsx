function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function StatusPill({ status }) {
    const s = String(status || "").toLowerCase();

    const styles =
        s === "pending"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : s === "approved"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : s === "denied" || s === "rejected"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : s === "canceled"
                        ? "border-slate-200 bg-slate-100 text-slate-700"
                        : "border-slate-200 bg-white text-slate-600";

    const label =
        s === "denied" ? "Denied" : s === "rejected" ? "Rejected" : s ? s[0].toUpperCase() + s.slice(1) : "—";

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                styles
            )}
        >
            {label}
        </span>
    );
}