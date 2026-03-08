import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/models';

export const routes: Routes = [
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
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./core/routes/sender.routes').then(m => m.SENDER_ROUTES),
    canMatch: [roleGuard],
    data: { role: Role.SENDER }
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./core/routes/courier.routes').then(m => m.COURIER_ROUTES),
    canMatch: [roleGuard],
    data: { role: Role.COURIER }
  },
  {
    path: '',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'verifications', loadComponent: () => import('./features/admin/pages/verifications/verifications').then(m => m.VerificationsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/pages/users/users').then(m => m.Users) },
      { path: 'settings', loadComponent: () => import('./features/settings/pages/settings').then(m => m.SettingsComponent) },
      { path: 'deliveries', loadComponent: () => import('./features/admin/pages/deliveries/deliveries').then(m => m.AdminDeliveriesComponent) }
    ],
    canMatch: [roleGuard],
    data: { role: Role.ADMIN }
  },
  {
    path: 'map',
    loadComponent: () => import('./features/shared/pages/map/map').then(m => m.Map)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/pages/not-found').then(m => m.NotFoundComponent)
  }
];
