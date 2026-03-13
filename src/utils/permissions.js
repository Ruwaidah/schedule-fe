export function isAssociate(user) {
  return user?.role_code === "ASSOCIATE";
}

export function isManager(user) {
  return ["ADMIN", "HR", "COACH", "TEAM_LEAD"].includes(user?.role_code);
}

export function canViewBudget(user) {
  return ["ADMIN", "HR"].includes(user?.role_code);
}

export function canViewReports(user) {
  return ["ADMIN", "HR", "COACH", "TEAM_LEAD"].includes(user?.role_code);
}