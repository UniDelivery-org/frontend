import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Page } from '../../../shared/models/api.page.model';
import { environment } from '../../../../environments/environment';
import { CourierStatsDTO, UpdateStatusRequestDTO } from './courier-delivery.dto';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { DeliveryStatus } from '../../../core/models/models';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CourierDeliveryApiService {
  private baseUrl = environment.apiUrl;
  private apiVersion = environment.apiVersion;
  private apiUrl = `${this.baseUrl}/${this.apiVersion}/delivery`;
  private toast = inject(ToastService);

  constructor(private http: HttpClient) {}

  // Get single delivery (shared endpoint)
  getDelivery(id: string): Observable<DeliveryResponseDTO> {
    return this.http.get<DeliveryResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger la livraison');
        return throwError(() => error);
      })
    );
  }

  // Get pending deliveries (shared endpoint)
  getPendingDeliveries(page: number = 0, size: number = 10): Observable<Page<DeliveryResponseDTO>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<DeliveryResponseDTO>>(`${this.apiUrl}/pending`, { params }).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les livraisons en attente');
        return throwError(() => error);
      })
    );
  }

  getDriverDeliveries(
    driverId: string,
    page: number = 0,
    size: number = 10,
  ): Observable<Page<DeliveryResponseDTO>> {
    let params = new HttpParams()
      .set('driverId', driverId)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<DeliveryResponseDTO>>(`${this.apiUrl}/driver`, { params }).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger vos livraisons');
        return throwError(() => error);
      })
    );
  }

  getDriverNearbyDeliveries(
    driverId: string,
    radius: number,
    page: number = 0,
    size: number = 10,
  ): Observable<Page<DeliveryResponseDTO>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<DeliveryResponseDTO>>(
      `${this.apiUrl}/driver/nearby/${driverId}/${radius}`,
      { params },
    ).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les livraisons à proximité');
        return throwError(() => error);
      })
    );
  }

  acceptDelivery(deliveryId: string, driverId: string): Observable<DeliveryResponseDTO> {
    let params = new HttpParams().set('driverId', driverId);
    return this.http.put<DeliveryResponseDTO>(
      `${this.apiUrl}/driver/${deliveryId}/accept`,
      {},
      { params },
    ).pipe(
      tap(() => this.toast.show('Livraison acceptée', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || "Impossible d'accepter la livraison");
        return throwError(() => error);
      })
    );
  }

  updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
  ): Observable<DeliveryResponseDTO> {
    const requestArgs: UpdateStatusRequestDTO = { status };
    return this.http.put<DeliveryResponseDTO>(`${this.apiUrl}/driver/${deliveryId}`, requestArgs).pipe(
      tap(() => this.toast.show('Statut mis à jour', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de mettre à jour le statut');
        return throwError(() => error);
      })
    );
  }

  getDriverActiveDelivery(driverId: string): Observable<DeliveryResponseDTO> {
    return this.http.get<DeliveryResponseDTO>(`${this.apiUrl}/driver/${driverId}/active`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger la livraison active');
        return throwError(() => error);
      })
    );
  }

  getDriverDeliveryHistory(
    driverId: string,
    status?: DeliveryStatus,
    page: number = 0,
    size: number = 10,
  ): Observable<Page<DeliveryResponseDTO>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Page<DeliveryResponseDTO>>(`${this.apiUrl}/driver/${driverId}/history`, {
      params,
    }).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || "Impossible de charger l'historique");
        return throwError(() => error);
      })
    );
  }

  getCourierStats(driverId: string): Observable<CourierStatsDTO> {
    return this.http.get<CourierStatsDTO>(`${this.apiUrl}/driver/${driverId}/stats`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les statistiques');
        return throwError(() => error);
      })
    );
  }
}
