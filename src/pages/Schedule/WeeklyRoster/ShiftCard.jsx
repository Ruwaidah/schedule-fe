import { calcLunchRange, getShiftHours } from "../../../utils/hours";

export default function ShiftCard({ shift, onClick }) {
  const hoursInfo = getShiftHours(shift.start_time, shift.end_time);
  const lunch = calcLunchRange(shift);
  return (
    <button
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:bg-slate-100"
      onClick={onClick}
    >
      <p className="text-xs font-semibold text-slate-900">
        {String(shift.start_time).slice(0, 5)}–{String(shift.end_time).slice(0, 5)}
      </p>
      <p className="text-[11px] text-slate-600">
        Dept #{shift.department_id} • {shift.status}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {hoursInfo.totalHours.toFixed(1)}h total
        {hoursInfo.lunchHours > 0 ? ` • ${hoursInfo.lunchHours}h lunch` : ""}
        {` • ${hoursInfo.paidHours.toFixed(1)}h paid`}
      </p>

      {lunch ? (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
          <span aria-hidden>🍽️</span>
          <span>Lunch {lunch.lunchStart}–{lunch.lunchEnd}</span>
        </div>
      ) : null}
    </button>
  );
}