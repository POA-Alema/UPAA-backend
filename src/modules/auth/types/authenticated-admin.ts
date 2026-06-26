import { AdminRole } from '../constants/admin-role';

export type AuthenticatedAdmin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type PublicAdminUser = AuthenticatedAdmin & {
  createdAt: Date;
  updatedAt: Date;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: AdminRole;
};
