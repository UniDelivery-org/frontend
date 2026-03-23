import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

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
  private toast = inject(ToastService);

  createLog(log: TrackingLogDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, log).pipe(
      catchError((error) => {
        this.toast.showError('Erreur de suivi', error.error?.message || "Impossible d'enregistrer la position");
        return throwError(() => error);
      })
    );
  }

  getHistory(deliveryId: string): Observable<TrackingLogDTO[]> {
    return this.http.get<TrackingLogDTO[]>(`${this.apiUrl}/${deliveryId}`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || "Impossible de charger l'historique de suivi");
        return throwError(() => error);
      })
    );
  }
}
