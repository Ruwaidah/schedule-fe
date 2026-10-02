# Scheduling App — Frontend

A full-stack, role-based workforce scheduling application for multi-department teams.

Includes manager and associate experiences, weekly schedule management, department filtering, time-off requests, shift swaps, schedule publishing, conflict detection, and role-based access control.

---

## Live Demo

🔗 [Open Scheduling App Demo](https://schedule-fe-jmpv.onrender.com/demo)

**No login required.**  
The portfolio demo automatically opens with seeded administrator access and realistic scheduling data.

> The Render server may take a few seconds to wake up after being inactive.

---

## Features

### Authentication & Roles (RBAC)

- JWT authentication
- One-click portfolio demo access
- Role-based routes and UI
- **Associate:** My Schedule + My Requests
- **Manager roles:** ADMIN / HR  / TEAM_LEAD
- Manager access to Dashboard + Weekly Roster + Requests + Reports

### Scheduling

- Saturday–Friday weekly scheduling
- Department-based roster filtering
- Create and edit employee shifts
- Locked-week protection
- Prevent editing past schedules
- Automatic schedule-week management
- Current and upcoming published schedule weeks
- Draft future schedule week

### Requests

- Time-off requests
- Shift-swap requests
- Manager request views
- Dashboard request summaries

### Schedule Validation

- Overlapping shift detection
- Backend conflict checking
- Role and department assignment validation

### Demo Data

The deployed demo uses realistic seeded PostgreSQL data including:

- Users
- Roles
- Departments
- User assignments
- Schedule weeks
- Shifts
- Time-off requests
- Shift-swap requests

---

## Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- Knex.js
- JWT
- bcrypt

---

## Repositories

- Backend: https://github.com/Ruwaidah/schedule-be
