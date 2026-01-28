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
      { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'sender',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/sender/sender-dashboard/sender-dashboard').then(m => m.SenderDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent) },
      { path: 'wallet', loadComponent: () => import('./pages/wallet/wallet').then(m => m.WalletComponent) },
      { path: 'activity', loadComponent: () => import('./pages/activity/activity').then(m => m.ActivityComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent) }
    ]
  },
  {
    path: 'courier',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/courier/courier-dashboard/courier-dashboard').then(m => m.CourierDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent) },
      { path: 'wallet', loadComponent: () => import('./pages/wallet/wallet').then(m => m.WalletComponent) },
      { path: 'documents', loadComponent: () => import('./pages/courier/documents/documents').then(m => m.DocumentsComponent) },
      { path: 'activity', loadComponent: () => import('./pages/activity/activity').then(m => m.ActivityComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent) }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'verifications', loadComponent: () => import('./pages/admin/verifications/verifications').then(m => m.VerificationsComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/users/users').then(m => m.Users) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent) }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent)
  }
];
