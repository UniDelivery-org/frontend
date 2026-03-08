import { Routes } from '@angular/router';
import { Role } from '../models/models';

export const COURIER_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../features/courier/pages/courier-dashboard/courier-dashboard').then(
        (m) => m.CourierDashboardComponent,
      ),
    data: { role: Role.COURIER }
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../../features/profile/pages/profile').then((m) => m.ProfileComponent),
    data: { role: Role.COURIER }
  },
  {
    path: 'wallet',
    loadComponent: () =>
      import('../../features/wallet/pages/wallet').then((m) => m.WalletComponent),
    data: { role: Role.COURIER }
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('../../features/courier/pages/documents/documents').then((m) => m.DocumentsComponent),
    data: { role: Role.COURIER }
  },
  {
    path: 'activity',
    loadComponent: () =>
      import('../../features/activity/pages/activity').then((m) => m.ActivityComponent),
    data: { role: Role.COURIER }
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../../features/settings/pages/settings').then((m) => m.SettingsComponent),
    data: { role: Role.COURIER }
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('../../features/courier/pages/vehicles/vehicles').then((m) => m.VehiclesComponent),
    data: { role: Role.COURIER }
  },
  {
    path: 'delivery/:id',
    loadComponent: () =>
      import('../../features/shared/pages/delivery-details/delivery-details').then(
        (m) => m.DeliveryDetailsComponent,
      ),
    data: { role: Role.COURIER }
  },
];
