# Retail Scheduling App — Frontend

A role-based scheduling UI for a multi-department retail store environment.  
Includes **Manager (HR/Admin/Lead)** and **Associate** experiences, weekly schedule views, and request workflows (time off + shift swaps).

> Portfolio project — not affiliated with any real company.

---

## Live Demo

🔗 [Schedule](https://schedule-fe-jmpv.onrender.com)

---

## Features

### Authentication & Roles (RBAC)
- JWT login with company account
- Role-based routes + UI:
  - **Associate**: My Schedule + My Requests
  - **Manager** (ADMIN/HR/COACH/TEAM_LEAD): Dashboard + Weekly Roster + Requests + Reports

### Scheduling
- Week runs **Saturday → Friday**
- Week navigation (prev/next)
- Department filtering (manager view)
- Shift create/edit/delete rules enforced by backend:
  - No edits for past days
  - Weeks can be **published/draft/locked** (from `schedule_weeks`)
  - Shift status is automatically enforced by week status

### Requests (Real Data)
- Time Off Requests
- Shift Swap Requests
- Dashboard shows real pending counts + latest requests

### Conflicts
- Shift conflicts from backend endpoint:
  - Detects overlapping shifts for the same associate on the same day.
  - Associates see their own conflicts; managers see store-wide conflicts.

---

## Tech Stack
- React (Vite)
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios (with auth interceptors)

---

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL