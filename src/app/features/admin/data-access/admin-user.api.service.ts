import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
import { Page } from '../../../shared/models/api.page.model';
import { environment } from '../../../../environments/environment';
import { Role } from '../../../core/models/models';
import { Profile } from '../../profile/profile';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AdminUserApiService {
  private baseUrl = environment.apiUrl;
  private apiVersion = environment.apiVersion;
  private apiUrl = `${this.baseUrl}/${this.apiVersion}/users/admin`;
  private toast = inject(ToastService);

  constructor(private http: HttpClient) {}

  private mapProfileAvatar(profile: Profile): Profile {
    if (profile && profile.avatarUrl && !profile.avatarUrl.startsWith('http')) {
      profile.avatarUrl = `http://localhost:8081${profile.avatarUrl}`;
    }
    return profile;
  }

  getAllUsers(
    search?: string,
    role?: Role,
    page: number = 0,
    size: number = 10,
  ): Observable<Page<Profile>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<Page<Profile>>(this.apiUrl, { params }).pipe(
      map((page) => ({
        ...page,
        content: page.content.map(p => this.mapProfileAvatar(p)),
      })),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les utilisateurs');
        return throwError(() => error);
      })
    );
  }

  blockUser(userId: string, reason?: string): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${userId}/block`, reason ? { reason } : {}).pipe(
      map(p => this.mapProfileAvatar(p)),
      tap(() => this.toast.show('Utilisateur bloqué avec succès', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de blocage', error.error?.message || "Impossible de bloquer l'utilisateur");
        return throwError(() => error);
      })
    );
  }

  unblockUser(userId: string): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${userId}/unblock`, {}).pipe(
      map(p => this.mapProfileAvatar(p)),
      tap(() => this.toast.show('Utilisateur débloqué avec succès', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de déblocage', error.error?.message || "Impossible de débloquer l'utilisateur");
        return throwError(() => error);
      })
    );
  }
}
