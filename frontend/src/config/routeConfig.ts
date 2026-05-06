export const departmentDashboardMap: Record<string, string> = {
  "Marketing & Sales": "/sales-dashboard",
  "Engineering": "/workspace-dashboard",
  "Administration": "/admin-ops-dashboard",
  "Finance": "/finance-dashboard"
};

export const getDashboardRoute = (user: any): string => {
  if (!user) return "/portal";
  if (user.role === "admin") return "/admin-dashboard";
  
  // Standard employee/manager mapping based on department
  if (user.department && departmentDashboardMap[user.department]) {
    return departmentDashboardMap[user.department];
  }

  // Fallback
  return "/dashboard";
};
