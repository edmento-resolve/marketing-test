// lib/roleUtils.ts

/**
 * Maps position names from the backend to proper role slugs for routing
 */
export const roleMapping: Record<string, string> = {
  'super admin': 'superadmin',
  'super%20admin': 'superadmin',
  'exam cell': 'examcell',
  'exam%20cell': 'examcell',
  'accounts': 'accounts',
  'admin': 'admin',
  'principal': 'principal',
  'coordinator': 'coordinator',
  'teacher': 'teacher',
  'parent': 'parent',
  'student': 'student'
};

/**
 * Converts a position name to a proper role slug
 * @param positionName - The position name from the backend
 * @returns The mapped role slug
 */
export function getRoleSlug(positionName: string): string {
  const normalizedName = positionName?.toLowerCase().trim() || '';
  return roleMapping[normalizedName] || normalizedName.replace(/\s+/g, '');
}

/**
 * Validates if a role slug is valid
 * @param roleSlug - The role slug to validate
 * @returns True if the role slug is valid
 */
export function isValidRoleSlug(roleSlug: string): boolean {
  const validRoles = ['superadmin', 'admin', 'principal', 'coordinator', 'teacher', 'parent', 'student', 'examcell', 'accounts'];
  return validRoles.includes(roleSlug);
}

/**
 * Gets the display name for a role slug
 * @param roleSlug - The role slug
 * @returns The display name for the role
 */
export function getRoleDisplayName(roleSlug: string): string {
  const displayNames: Record<string, string> = {
    'superadmin': 'Super Admin',
    'admin': 'Admin',
    'principal': 'Principal',
    'coordinator': 'Coordinator',
    'teacher': 'Teacher',
    'parent': 'Parent',
    'student': 'Student',
    'examcell': 'Exam Cell',
    'accounts': 'Accounts'
  };
  return displayNames[roleSlug] || roleSlug;
}
