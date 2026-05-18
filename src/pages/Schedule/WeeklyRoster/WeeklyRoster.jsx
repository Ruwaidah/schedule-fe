import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../../api/client";
import { clearScheduleErrors } from "../../../features/schedule/scheduleSlice";

import {
  fetchWeekSchedule,
  updateShift,
  deleteShift,
  createShift,
  selectWeekShifts,
  selectScheduleStatus,
  selectScheduleError,
  selectScheduleSaving,
  selectScheduleSaveError,
} from "../../../features/schedule/scheduleSlice";

import { fetchDepartments, selectDepartments } from "../../../features/departments/departmentsSlice";
import { fetchEmployees, selectEmployees } from "../../../features/employees/employeesSlice";

import { canEditSchedule } from "../../../utils/roles";
import { addDays, startOfWeekSaturday, toYYYYMMDD, weekDiff } from "../../../utils/date";
import { getShiftHours } from "../../../utils/hours";

import RosterHeader from "./RosterHeader";
import ShiftCard from "./ShiftCard";
import EditShiftModal from "../EditShiftModal";
import CreateShiftModal from "../../WeeklySchedule/CreateShiftModal";
import DashboardHeader from "../../Dashboard/DashboardHeader";

export default function WeeklyRoster() {
  const dispatch = useDispatch();

  const authUser = useSelector((s) => s.auth.user);
  const storeId = authUser?.store_id;
  const canEditByRole = canEditSchedule(authUser);

  const shifts = useSelector(selectWeekShifts);
  const status = useSelector(selectScheduleStatus);
  const error = useSelector(selectScheduleError);
  const saving = useSelector(selectScheduleSaving);
  const saveError = useSelector(selectScheduleSaveError);
  const departments = useSelector(selectDepartments);
  const employees = useSelector(selectEmployees);

  const [departmentId, setDepartmentId] = useState("");
  const [anchorDate, setAnchorDate] = useState(() => toYYYYMMDD(new Date()));
  const [weekStatus, setWeekStatus] = useState("draft");
  const [allowedDepartments, setAllowedDepartments] = useState([]);

  const [selectedShift, setSelectedShift] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [createPrefill, setCreatePrefill] = useState({ date: "", userId: "" });

  const [deptEmployees, setDeptEmployees] = useState([]);

  const weekStart = useMemo(() => startOfWeekSaturday(new Date(anchorDate)), [anchorDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const start_date = useMemo(() => toYYYYMMDD(weekStart), [weekStart]);
  const end_date = useMemo(() => toYYYYMMDD(weekEnd), [weekEnd]);

  const currentWeekStart = useMemo(() => startOfWeekSaturday(new Date()), []);
  const viewingWeekOffset = useMemo(() => weekDiff(weekStart, currentWeekStart), [weekStart, currentWeekStart]);

  const withinEditableWindow = viewingWeekOffset >= 0 && viewingWeekOffset <= 3;
  const weekLocked = weekStatus === "locked";
  const canEditWeek = withinEditableWindow && !weekLocked; // draft or published
  const canEdit = canEditByRole && canEditWeek;
  const canDelete = canEditByRole && canEditWeek;
  const isLoading = status === "loading";

  const rosterEmployees = departmentId ? deptEmployees : employees;


  useEffect(() => {
    if (!storeId) return;
    dispatch(fetchDepartments({ store_id: storeId }));
    dispatch(fetchEmployees({ store_id: storeId }));
  }, [dispatch, storeId]);

  useEffect(() => {
    if (!storeId) return;

    (async () => {
      try {
        const res = await api.get("/api/schedule-weeks", { params: { store_id: storeId } });
        const weeks = res.data || [];
        const w = weeks.find((x) => String(x.week_start_date).slice(0, 10) === start_date);

        if (w?.status) setWeekStatus(w.status);
        else if (viewingWeekOffset < 0 || viewingWeekOffset > 3) setWeekStatus("locked");
        else setWeekStatus("draft");
      } catch {
        setWeekStatus(viewingWeekOffset < 0 || viewingWeekOffset > 3 ? "locked" : "draft");
      }
    })();
  }, [storeId, start_date, viewingWeekOffset]);

  useEffect(() => {
    if (!storeId) return;

    if (!departmentId) {
      setDeptEmployees([]);
      return;
    }

    (async () => {
      const res = await api.get("/api/user-assignments/users", {
        params: { store_id: storeId, department_id: departmentId },
      });
      setDeptEmployees(res.data || []);
    })();
  }, [storeId, departmentId]);

  useEffect(() => {
    if (!storeId) return;

    dispatch(
      fetchWeekSchedule({
        store_id: storeId,
        start_date,
        end_date,
        ...(departmentId ? { department_id: departmentId } : {}),
      })
    );
  }, [dispatch, storeId, start_date, end_date, departmentId]);


  function isPastShift(shift) {
    const key = String(shift.shift_date).slice(0, 10);
    return key < toYYYYMMDD(new Date());
  }

  async function refetchWeek() {
    if (!storeId) return;

    await dispatch(
      fetchWeekSchedule({
        store_id: storeId,
        start_date,
        end_date,
        ...(departmentId ? { department_id: departmentId } : {}),
      })
    );
  }

  async function openCreateFor(userId, dateStr) {
    try {
      setCreatePrefill({ date: dateStr, userId });

      const res = await api.get("/api/user-assignments/departments", {
        params: { store_id: storeId, user_id: userId },
      });

      setAllowedDepartments(res.data || []);
      setOpenCreate(true);
    } catch {
      setAllowedDepartments([]);
      setOpenCreate(true);
    }
  }

  async function openEditFor(shift) {
    try {
      setSelectedShift(shift);

      const res = await api.get("/api/user-assignments/departments", {
        params: { store_id: storeId, user_id: shift.user_id },
      });

      setAllowedDepartments(res.data || []);
      setOpenEdit(true);
    } catch {
      setAllowedDepartments([]);
      setOpenEdit(true);
    }
  }

  async function handleCreateShift(values) {
    const today = toYYYYMMDD(new Date());
    if (values.shift_date < today) throw new Error("You can only create shifts for today or future dates.");

    const payload = {
      store_id: storeId,
      user_id: values.user_id ? Number(values.user_id) : null,
      department_id: Number(values.department_id),
      shift_date: values.shift_date,
      start_time: values.start_time,
      end_time: values.end_time,
    };

    await dispatch(createShift(payload)).unwrap();
    await refetchWeek();
    setOpenCreate(false);
  }

  async function handleUpdateShift({ shiftId, patch }) {
    await dispatch(updateShift({ shiftId, patch })).unwrap();
    await refetchWeek();
  }

  async function handleDeleteShift({ shiftId }) {
    await dispatch(deleteShift({ shiftId })).unwrap();
    await refetchWeek();
    setOpenEdit(false);
    setSelectedShift(null);
  }

  const days = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => toYYYYMMDD(addDays(weekStart, i))),
    [weekStart]
  );

  const roster = useMemo(() => {
    const map = new Map();

    // filtered employees when dept filter active
    for (const emp of rosterEmployees) {
      map.set(emp.id, {
        user: { id: emp.id, first_name: emp.first_name, last_name: emp.last_name },
        days: new Map(),
      });
    }

    // hide unassigned when filtering by dept
    if (!departmentId) {
      map.set("unassigned", {
        user: { id: "unassigned", first_name: "Unassigned", last_name: "" },
        days: new Map(),
      });
    }

    // place shifts
    for (const s of shifts) {
      const dateKey = String(s.shift_date).slice(0, 10);
      const key = s.user_id ? s.user_id : "unassigned";

      // filtering by dept, only include shifts for users in the filtered list
      if (departmentId && key !== "unassigned" && !map.has(key)) continue;

      if (!map.has(key)) {
        map.set(key, {
          user: { id: key, first_name: s.first_name || "", last_name: s.last_name || "" },
          days: new Map(),
        });
      }

      const entry = map.get(key);
      if (!entry.days.has(dateKey)) entry.days.set(dateKey, []);
      entry.days.get(dateKey).push(s);
    }

    const arr = Array.from(map.values()).filter((r) => r.user.id !== "unassigned");
    arr.sort((a, b) => {
      const ax = `${a.user.first_name} ${a.user.last_name}`.toLowerCase();
      const bx = `${b.user.first_name} ${b.user.last_name}`.toLowerCase();
      return ax.localeCompare(bx);
    });

    if (!departmentId) arr.push(map.get("unassigned"));
    return arr;
  }, [rosterEmployees, shifts, departmentId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <RosterHeader
          start_date={start_date}
          end_date={end_date}
          viewingWeekOffset={viewingWeekOffset}
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          departments={departments}
          anchorDate={anchorDate}
          setAnchorDate={setAnchorDate}
          onPrevWeek={() => setAnchorDate(toYYYYMMDD(addDays(weekEnd, -7)))}
          onNextWeek={() => setAnchorDate(toYYYYMMDD(addDays(weekEnd, 7)))}
          isLoading={isLoading}
          weekStatus={weekStatus}
        />

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : roster.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No shifts found for this week.
            </div>
          ) : (
            <div className="space-y-6">
              {roster.map((row) => {
                const weeklyHours = days.reduce((sum, d) => {
                  const items = row.days.get(d) || [];
                  return sum + items.reduce((s2, sh) => s2 + getShiftHours(sh.start_time, sh.end_time).paidHours, 0);
                }, 0);

                return (
                  <div key={row.user.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        {row.user.first_name} {row.user.last_name}
                      </p>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {weeklyHours.toFixed(1)} hrs
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                      {days.map((d) => {
                        const items = row.days.get(d) || [];
                        const isPastDay = d < toYYYYMMDD(new Date());

                        return (
                          <div key={d} className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-700">
                                {new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })}
                              </p>
                              <p className="text-[11px] text-slate-500">{d}</p>
                            </div>

                            {items.length === 0 ? (
                              canEdit && row.user.id !== "unassigned" && !isPastDay ? (
                                <button
                                  type="button"
                                  className="mt-2 w-full rounded-xl border border-dashed border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                  onClick={() => openCreateFor(row.user.id, d)}
                                >
                                  + Add shift
                                </button>
                              ) : (
                                <p className="mt-2 text-xs text-slate-500">—</p>
                              )
                            ) : (
                              <div className="mt-2 space-y-2">
                                {items.map((shift) => (
                                  <ShiftCard key={shift.id} shift={shift} onClick={() => openEditFor(shift)} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <CreateShiftModal
            open={openCreate}
            onClose={() => {
              dispatch(clearScheduleErrors());
              setOpenCreate(false);
            }}
            canCreate={canEdit}
            defaultDate={createPrefill.date}
            defaultUserId={createPrefill.userId}
            employees={employees}
            allowedDepartments={allowedDepartments}
            saving={saving}
            saveError={saveError}
            onCreate={handleCreateShift}
            weekStatus={weekStatus}
          />

          <EditShiftModal
            open={openEdit}
            onClose={() => {
              dispatch(clearScheduleErrors());
              setOpenEdit(false);
              setSelectedShift(null);
            }}
            canEdit={canEdit && selectedShift && !isPastShift(selectedShift)}
            canDelete={canDelete && selectedShift && !isPastShift(selectedShift)}
            shift={selectedShift}
            departments={allowedDepartments.length ? allowedDepartments : departments}
            employees={employees}
            saving={saving}
            saveError={saveError}
            getShiftHours={getShiftHours}
            onUpdateShift={handleUpdateShift}
            onDeleteShift={handleDeleteShift}
          />
        </div>
      </div>
    </div>
  );
}