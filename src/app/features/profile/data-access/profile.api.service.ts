import { inject, Injectable } from '@angular/core';
import { UpdateProfileRequestDTO } from './update-profile.dto';
import { map, Observable, of } from 'rxjs';
import { Profile } from '../profile';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly apiVersion = environment.apiVersion;
  public load(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${this.apiVersion}/users/profile`);
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

    return this.http.put<Profile>(`${this.apiUrl}/${this.apiVersion}/users/update`, formData);
  }
  public delete(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.apiVersion}/users/profile`);
  }
}
