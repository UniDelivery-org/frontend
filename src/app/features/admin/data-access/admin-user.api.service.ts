import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Page } from '../../../shared/models/api.page.model';
import { environment } from '../../../../environments/environment';
import { Role } from '../../../core/models/models';
import { Profile } from '../../profile/profile';

@Injectable({
  providedIn: 'root',
})
export class AdminUserApiService {
  private baseUrl = environment.apiUrl;
  private apiVersion = environment.apiVersion;
  private apiUrl = `${this.baseUrl}/${this.apiVersion}/users/admin`;

  constructor(private http: HttpClient) {}

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
        content: page.content.map((profile) => ({
          ...profile,
          avatarUrl: profile.avatarUrl ? 'http://localhost:8081' + profile.avatarUrl : null,
        })),
      })),
    );
  }

  blockUser(userId: string, reason?: string): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${userId}/block`, reason ? { reason } : {});
  }

  unblockUser(userId: string): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${userId}/unblock`, {});
  }
}
