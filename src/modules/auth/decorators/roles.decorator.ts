import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../constants/admin-role';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
