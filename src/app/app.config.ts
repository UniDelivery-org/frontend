import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as AuthEffects from './features/auth/store/auth.effect';
import * as ProfileEffects from './features/profile/store/profile.effect';
import * as SenderDeliveryEffects from './features/sender/store/sender-delivery.effects';
import * as CourierDeliveryEffects from './features/courier/store/courier-delivery.effects';
import * as AdminDeliveryEffects from './features/admin/store/admin-delivery.effects';
import { AdminUserEffects } from './features/admin/store/admin-users.effects';
import { authFeature } from './features/auth/store/auth.reducer';
import { profileFeature } from './features/profile/store/profile.reducer';
import { senderDeliveryFeature } from './features/sender/store/sender-delivery.reducer';
import { courierDeliveryFeature } from './features/courier/store/courier-delivery.reducer';
import { adminDeliveryFeature } from './features/admin/store/admin-delivery.reducer';
import { adminUsersFeature } from './features/admin/store/admin-users.reducer';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideState(authFeature),
    provideState(profileFeature),
    provideState(senderDeliveryFeature),
    provideState(courierDeliveryFeature),
    provideState(adminDeliveryFeature),
    provideState(adminUsersFeature),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(
      AuthEffects,
      ProfileEffects,
      SenderDeliveryEffects,
      CourierDeliveryEffects,
      AdminDeliveryEffects,
      AdminUserEffects,
    ),
  ],
};
