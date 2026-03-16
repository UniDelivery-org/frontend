import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TrackingLogDTO {
  deliveryId: string;
  lat: number;
  lon: number;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrackingApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/tracking`;

  createLog(log: TrackingLogDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, log);
  }

  getHistory(deliveryId: string): Observable<TrackingLogDTO[]> {
    return this.http.get<TrackingLogDTO[]>(`${this.apiUrl}/${deliveryId}`);
  }
}
