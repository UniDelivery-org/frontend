import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from '../../../core/services/cookie.service';
import { RegisterDto } from './register.dto';
import { map, Observable, of, tap } from 'rxjs';
import { Profile } from '../../profile/profile';
import { Auth } from '../auth';
import { LoginDto } from './login.dto';
import { JwtResolverService } from '../../../core/services/jwtResolver.service';
import { RoleService } from '../../../core/services/role.service';
import { Role } from '../../../core/models/models';

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

  public register(payload: RegisterDto): Observable<Profile> {
    return this.http
      .post<Profile>(`${this.apiUrl}/${this.apiVersion}/users/register`, payload)
      .pipe(tap(() => this.router.navigate(['/auth/login'])));
  }
  public login(payload: LoginDto): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiUrl}/${this.apiVersion}/users/login`, payload).pipe(
      map((response) => {
        return this.handleAuthResponse(response);
      }),
      tap(() => this.router.navigate(['/'])),
    );
  }
  public refreshToken(): Observable<Auth> {
    const TOKEN = this.cookie.get('refreshToken');
    return this.http.post<Auth>(`${this.apiUrl}/${this.apiVersion}/users/refresh`, { refreshToken: TOKEN }).pipe(
      map((response) => {
        return this.handleAuthResponse(response);
      }),
      tap(() => this.router.navigate(['/'])),
    );
  }
  public logout(): Observable<void> {
    return of(this.deleteCookies()).pipe(tap(() => this.router.navigate(['/auth/login'])));
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
    this.roleService.setRole(payload.realm_access.roles[0] as Role, response.expiresIn);
    return response;
  }
}
