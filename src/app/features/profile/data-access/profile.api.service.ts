import { inject, Injectable } from '@angular/core';
import { UpdateProfileRequestDTO } from './update-profile.dto';
import { map, Observable, of, tap, catchError, throwError } from 'rxjs';
import { Profile } from '../profile';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly apiVersion = environment.apiVersion;
  private toast = inject(ToastService);
  public load(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${this.apiVersion}/users/profile`).pipe(
      map((profile) => ({
        ...profile,
        avatarUrl: profile.avatarUrl ? 'http://localhost:8081' + profile.avatarUrl : null,
      })),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger le profil');
        return throwError(() => error);
      })
    );
  }
  public update(payload: UpdateProfileRequestDTO): Observable<Profile> {
    const formData = new FormData();
    if (payload.fullName) formData.append('fullName', payload.fullName);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.avatar !== undefined) {
      if (payload.avatar === null) {
        formData.append('deleteAvatar', 'true');
      } else {
        formData.append('avatar', payload.avatar);
      }
    }
    if (payload.currentLat !== undefined)
      formData.append('currentLat', payload.currentLat.toString());
    if (payload.currentLon !== undefined)
      formData.append('currentLon', payload.currentLon.toString());
    if(payload.isOnline!== undefined)
      formData.append('isOnline', payload.isOnline.toString());

    return this.http.put<Profile>(`${this.apiUrl}/${this.apiVersion}/users/update`, formData).pipe(
      map((profile) => ({
        ...profile,
        avatarUrl: profile.avatarUrl && !profile.avatarUrl.startsWith('http') ? 'http://localhost:8081' + profile.avatarUrl : profile.avatarUrl,
      })),
      tap(() => this.toast.show('Profil mis à jour', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de mise à jour', error.error?.message || 'Impossible de mettre à jour le profil');
        return throwError(() => error);
      })
    );
  }
  public delete(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiVersion}/users/profile`).pipe(
      tap(() => this.toast.show('Profil supprimé', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de supprimer le profil');
        return throwError(() => error);
      })
    );
  }
}
