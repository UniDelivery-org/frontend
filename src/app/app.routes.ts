import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'sender',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/sender/pages/sender-dashboard/sender-dashboard').then(m => m.SenderDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./features/profile/pages/profile').then(m => m.ProfileComponent) },
      { path: 'wallet', loadComponent: () => import('./features/wallet/pages/wallet').then(m => m.WalletComponent) },
      { path: 'activity', loadComponent: () => import('./features/activity/pages/activity').then(m => m.ActivityComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/pages/settings').then(m => m.SettingsComponent) },
      { path: 'new-delivery', loadComponent: () => import('./features/sender/pages/new-delivery/new-delivery').then(m => m.NewDeliveryComponent) },
      { path: 'delivery/:id', loadComponent: () => import('./features/shared/pages/delivery-details/delivery-details').then(m => m.DeliveryDetailsComponent) }
    ]
  },
  {
    path: 'courier',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/courier/pages/courier-dashboard/courier-dashboard').then(m => m.CourierDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./features/profile/pages/profile').then(m => m.ProfileComponent) },
      { path: 'wallet', loadComponent: () => import('./features/wallet/pages/wallet').then(m => m.WalletComponent) },
      { path: 'documents', loadComponent: () => import('./features/courier/pages/documents/documents').then(m => m.DocumentsComponent) },
      { path: 'activity', loadComponent: () => import('./features/activity/pages/activity').then(m => m.ActivityComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/pages/settings').then(m => m.SettingsComponent) },
      { path: 'vehicles', loadComponent: () => import('./features/courier/pages/vehicles/vehicles').then(m => m.VehiclesComponent) },
      { path: 'delivery/:id', loadComponent: () => import('./features/shared/pages/delivery-details/delivery-details').then(m => m.DeliveryDetailsComponent) }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'verifications', loadComponent: () => import('./features/admin/pages/verifications/verifications').then(m => m.VerificationsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/pages/users/users').then(m => m.Users) },
      { path: 'settings', loadComponent: () => import('./features/settings/pages/settings').then(m => m.SettingsComponent) },
      { path: 'deliveries', loadComponent: () => import('./features/admin/pages/deliveries/deliveries').then(m => m.AdminDeliveriesComponent) }
    ]
  },
  {
    path: 'map',
    loadComponent: () => import('./features/shared/pages/map/map').then(m => m.Map)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/pages/not-found').then(m => m.NotFoundComponent)
  }
];
