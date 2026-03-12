export function canEditSchedule(user) {
    const role = user?.role_code;
    return role === "HR" || role === "ADMIN" || role === "COACH" || role === "TEAM_LEAD";
}

export function isAssociate(user) {
    return user?.role_code === "ASSOCIATE";
}