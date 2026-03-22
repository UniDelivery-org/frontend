import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { DeliveryRequestDTO, DeliveryResponseDTO, SenderStatsDTO } from './delivery.dto';
import { Page } from '../../../shared/models/api.page.model';
import { DeliveryStatus } from '../../../core/models/models';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class SenderDeliveryApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly version = environment.apiVersion;
  private readonly apiUrl = `${this.baseUrl}/${this.version}`;
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  getDelivery(id: string): Observable<DeliveryResponseDTO> {
    return this.http.get<DeliveryResponseDTO>(`${this.apiUrl}/delivery/${id}`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger la livraison');
        return throwError(() => error);
      })
    );
  }
  createDelivery(deliveryRequest: DeliveryRequestDTO): Observable<DeliveryResponseDTO> {
    return this.http.post<DeliveryResponseDTO>(`${this.apiUrl}/delivery/customer`, deliveryRequest).pipe(
      tap(() => this.toast.show('Livraison créée', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de création', error.error?.message || 'Impossible de créer la livraison');
        return throwError(() => error);
      })
    );
  }
  updateDelivery(id: string, deliveryRequest: DeliveryRequestDTO): Observable<DeliveryResponseDTO> {
    return this.http.put<DeliveryResponseDTO>(`${this.apiUrl}/delivery/customer/${id}`, deliveryRequest).pipe(
      tap(() => this.toast.show('Livraison mise à jour', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de mise à jour', error.error?.message || 'Impossible de mettre à jour la livraison');
        return throwError(() => error);
      })
    );
  }
  deleteDelivery(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delivery/customer/${id}`).pipe(
      tap(() => this.toast.show('Livraison supprimée', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de suppression', error.error?.message || 'Impossible de supprimer la livraison');
        return throwError(() => error);
      })
    );
  }
  getCustomerDeliveries(
    customerId: string,
    page?: number,
    size?: number,
  ): Observable<Page<DeliveryResponseDTO>> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<Page<DeliveryResponseDTO>>(
      `${this.apiUrl}/delivery/customer/${customerId}`,
      { params },
    ).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger vos livraisons');
        return throwError(() => error);
      })
    );
  }
  getActiveDeliveries(
    customerId: string,
    page?: number,
    size?: number,
  ): Observable<Page<DeliveryResponseDTO>> {
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<Page<DeliveryResponseDTO>>(
      `${this.apiUrl}/delivery/customer/${customerId}/active`,
      { params },
    ).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les livraisons actives');
        return throwError(() => error);
      })
    );
  }
  getDeliveryHistory(
    customerId: string,
    status?: DeliveryStatus,
    page?: number,
    size?: number,
  ): Observable<Page<DeliveryResponseDTO>> {
    const params: any = {};
    if (status !== undefined) params.status = status;
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return this.http.get<Page<DeliveryResponseDTO>>(
      `${this.apiUrl}/delivery/customer/${customerId}/history`,
      { params },
    ).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || "Impossible de charger l'historique");
        return throwError(() => error);
      })
    );
  }
  getSenderStats(customerId: string): Observable<SenderStatsDTO> {
    return this.http.get<SenderStatsDTO>(`${this.apiUrl}/delivery/customer/${customerId}/stats`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les statistiques');
        return throwError(() => error);
      })
    );
  }
}
