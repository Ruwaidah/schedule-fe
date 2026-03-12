export function getShiftHours(startTime, endTime) {
  if (!startTime || !endTime) return { totalHours: 0, lunchHours: 0, paidHours: 0 };

  const [sh, sm] = String(startTime).slice(0, 5).split(":").map(Number);
  const [eh, em] = String(endTime).slice(0, 5).split(":").map(Number);

  const startTotal = sh * 60 + sm;
  const endTotal = eh * 60 + em;

  let minutes = endTotal - startTotal;
  if (minutes < 0) minutes += 24 * 60;

  const totalHours = minutes / 60;
  const lunchHours = totalHours > 5 ? 1 : 0;
  const paidHours = totalHours - lunchHours;

  return { totalHours, lunchHours, paidHours };
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

export function calcLunchRange(shift) {
  const start = toMinutes(shift.start_time);
  const end = toMinutes(shift.end_time);
  const duration = end - start;

  if (duration < 6 * 60) return null;

  const lunchStart = start + 4 * 60;
  const lunchEnd = lunchStart + 60;
  if (lunchEnd > end) return null;

  return { lunchStart: toHHMM(lunchStart), lunchEnd: toHHMM(lunchEnd) };
}