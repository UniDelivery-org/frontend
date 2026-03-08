import { Routes } from '@angular/router';
import { Role } from '../models/models';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../features/admin/pages/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboardComponent,
      ),

    data: { role: Role.ADMIN },
  },
  {
    path: 'verifications',
    loadComponent: () =>
      import('../../features/admin/pages/verifications/verifications').then(
        (m) => m.VerificationsComponent,
      ),

    data: { role: Role.ADMIN },
  },
  {
    path: 'users',
    loadComponent: () => import('../../features/admin/pages/users/users').then((m) => m.Users),

    data: { role: Role.ADMIN },
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../../features/settings/pages/settings').then((m) => m.SettingsComponent),

    data: { role: Role.ADMIN },
  },
  {
    path: 'deliveries',
    loadComponent: () =>
      import('../../features/admin/pages/deliveries/deliveries').then(
        (m) => m.AdminDeliveriesComponent,
      ),

    data: { role: Role.ADMIN },
  },
];
