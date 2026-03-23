import { Routes } from '@angular/router';
import { Role } from '../models/models';

export const SENDER_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../features/sender/pages/sender-dashboard/sender-dashboard').then(
        (m) => m.SenderDashboardComponent,
      ),
    data: { role: Role.SENDER }
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../../features/profile/pages/profile').then((m) => m.ProfileComponent),
    data: { role: Role.SENDER }
  },
  {
    path: 'wallet',
    loadComponent: () =>
      import('../../features/wallet/pages/wallet').then((m) => m.WalletComponent),
    data: { role: Role.SENDER }
  },
  {
    path: 'activity',
    loadComponent: () =>
      import('../../features/activity/pages/activity').then((m) => m.ActivityComponent),
    data: { role: Role.SENDER }
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../../features/settings/pages/settings').then((m) => m.SettingsComponent),
    data: { role: Role.SENDER }
  },
  {
    path: 'new-delivery',
    loadComponent: () =>
      import('../../features/sender/pages/new-delivery/new-delivery').then(
        (m) => m.NewDeliveryComponent,
      ),
    data: { role: Role.SENDER }
  },
  {
    path: 'delivery/:id',
    loadComponent: () =>
      import('../../features/shared/pages/delivery-details/delivery-details').then(
        (m) => m.DeliveryDetailsComponent,
      ),
    data: { role: Role.SENDER }
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('../../features/payment/pages/payment').then(
        (m) => m.PaymentPageComponent,
      ),
    data: { role: Role.SENDER }
  },
];
