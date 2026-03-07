export default function Field({ label, children, error }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            {children}
            {error ? <p className="text-xs text-rose-600">{error}</p> : null}
        </div>
    );
}