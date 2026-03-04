// lib/roleMap.ts

// Map of roleId (from DB) → slug used in dashboard URLs
export const roleIdToSlug: Record<number, string> = {
  1: "superadmin",  // Super Admin dashboard
  2: "admin",       // Admin dashboard
  3: "principal",   // Principal dashboard
  4: "coordinator", // Coordinator dashboard
  5: "teacher",     // Teacher dashboard
  6: "parent",      // Parent dashboard
  7: "student",     // Student dashboard
  8: "examcell",    // Exam Cell dashboard
  9: "accounts",    // Accounts dashboard
  // Add more roles here as needed
};
