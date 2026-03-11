import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../shared/models/api.page.model';
import { environment } from '../../../../environments/environment';
import { CourierStatsDTO, UpdateStatusRequestDTO } from './courier-delivery.dto';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { DeliveryStatus } from '../../../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class CourierDeliveryApiService {
  private baseUrl = environment.apiUrl;
  private apiVersion = environment.apiVersion;
  private apiUrl = `${this.baseUrl}/${this.apiVersion}/delivery`;

  constructor(private http: HttpClient) {}

  // Get single delivery (shared endpoint)
  getDelivery(id: string): Observable<DeliveryResponseDTO> {
    return this.http.get<DeliveryResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Get pending deliveries (shared endpoint)
  getPendingDeliveries(page: number = 0, size: number = 10): Observable<Page<DeliveryResponseDTO>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<DeliveryResponseDTO>>(`${this.apiUrl}/pending`, { params });
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

    return this.http.get<Page<DeliveryResponseDTO>>(`${this.apiUrl}/driver`, { params });
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
    );
  }

  acceptDelivery(deliveryId: string, driverId: string): Observable<DeliveryResponseDTO> {
    let params = new HttpParams().set('driverId', driverId);
    return this.http.put<DeliveryResponseDTO>(
      `${this.apiUrl}/driver/${deliveryId}/accept`,
      {},
      { params },
    );
  }

  updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
  ): Observable<DeliveryResponseDTO> {
    const requestArgs: UpdateStatusRequestDTO = { status };
    return this.http.put<DeliveryResponseDTO>(`${this.apiUrl}/driver/${deliveryId}`, requestArgs);
  }

  getDriverActiveDelivery(driverId: string): Observable<DeliveryResponseDTO> {
    return this.http.get<DeliveryResponseDTO>(`${this.apiUrl}/driver/${driverId}/active`);
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
    });
  }

  getCourierStats(driverId: string): Observable<CourierStatsDTO> {
    return this.http.get<CourierStatsDTO>(`${this.apiUrl}/driver/${driverId}/stats`);
  }
}
