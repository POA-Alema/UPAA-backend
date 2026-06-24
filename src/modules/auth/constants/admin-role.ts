export enum AdminRole {
  ADMIN = 'ADMIN',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
}

export function normalizeAdminRole(role: string): AdminRole {
  const normalized = role.trim().toUpperCase();

  if (normalized === 'ADMIN') {
    return AdminRole.ADMIN;
  }

  if (normalized === 'CONTENT_MANAGER' || normalized === 'CONTENT-MANAGER') {
    return AdminRole.CONTENT_MANAGER;
  }

  return AdminRole.CONTENT_MANAGER;
}
