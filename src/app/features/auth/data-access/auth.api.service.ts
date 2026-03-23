import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from '../../../core/services/cookie.service';
import { RegisterDto } from './register.dto';
import { map, Observable, of, tap, catchError, throwError } from 'rxjs';
import { Profile } from '../../profile/profile';
import { Auth } from '../auth';
import { LoginDto } from './login.dto';
import { JwtResolverService } from '../../../core/services/jwtResolver.service';
import { RoleService } from '../../../core/services/role.service';
import { Role } from '../../../core/models/models';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly apiVersion = environment.apiVersion;
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookie = inject(CookieService);
  private jwtResolver = inject(JwtResolverService);
  private roleService = inject(RoleService);
  private toast = inject(ToastService);

  public register(payload: RegisterDto): Observable<Profile> {
    return this.http
      .post<Profile>(`${this.apiUrl}/${this.apiVersion}/users/register`, payload)
      .pipe(
        tap(() => {
          this.toast.show('Inscription réussie', 'success');
          this.router.navigate(['/auth/login']);
        }),
        catchError((error) => {
          this.toast.showError('Échec de l\'inscription', error.error?.message || 'Une erreur est survenue');
          return throwError(() => error);
        })
      );
  }
  public login(payload: LoginDto): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiUrl}/${this.apiVersion}/users/login`, payload).pipe(
      map((response) => {
        return this.handleAuthResponse(response);
      }),
      tap(() => {
        this.toast.show('Connexion réussie', 'success');
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        this.toast.showError('Échec de la connexion', error.error?.message || 'Email ou mot de passe incorrect');
        return throwError(() => error);
      })
    );
  }
  public refreshToken(): Observable<Auth> {
    const TOKEN = this.cookie.get('refreshToken');
    return this.http
      .post<Auth>(`${this.apiUrl}/${this.apiVersion}/users/refresh`, { refreshToken: TOKEN })
      .pipe(
        map((response) => {
          return this.handleAuthResponse(response);
        }),
        catchError((error) => {
          this.deleteCookies();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
  }
  public logout(): Observable<void> {
    return of(this.deleteCookies()).pipe(
      tap(() => {
        this.toast.show('Déconnexion réussie', 'info');
        this.router.navigate(['/auth/login']);
      })
    );
  }
  private deleteCookies(): void {
    this.cookie.destroy('accessToken');
    this.cookie.destroy('refreshToken');
    this.roleService.deleteRole();
  }
  private handleAuthResponse(response: Auth): Auth {
    this.cookie.set('refreshToken', response.refreshToken, 30 * 60);
    this.cookie.set('accessToken', response.accessToken, response.expiresIn);
    const payload = this.jwtResolver.decodeToken(response.accessToken);
    this.roleService.setRole(payload.realm_access.roles[0] as Role, 30 * 60);
    return response;
  }
}
