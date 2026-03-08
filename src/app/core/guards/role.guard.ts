import { CanMatchFn } from '@angular/router';
import { RoleService } from '../services/role.service';
import { inject } from '@angular/core';
import { Role } from '../models/models';

export const roleGuard: CanMatchFn = (route, segments) => {
  const roleService = inject(RoleService);
  const role = roleService.getRole();
  const requiredRole: Role = route.data?.['role'];
  if (role === requiredRole) {
    return true;
  }
  return false;
};
