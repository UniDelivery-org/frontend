import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryRequestDTO, DeliveryResponseDTO, SenderStatsDTO } from './delivery.dto';
import { Page } from '../../../shared/models/api.page.model';
import { DeliveryStatus } from '../../../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class SenderDeliveryApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly version = environment.apiVersion;
  private readonly apiUrl = `${this.baseUrl}/${this.version}`;
  private http = inject(HttpClient);

  getDelivery(id: string): Observable<DeliveryResponseDTO> {
    return this.http.get<DeliveryResponseDTO>(`${this.apiUrl}/deliveries/${id}`);
  }
  createDelivery(deliveryRequest: DeliveryRequestDTO): Observable<DeliveryResponseDTO> {
    return this.http.post<DeliveryResponseDTO>(`${this.apiUrl}/deliveries`, deliveryRequest);
  }
  updateDelivery(id: string, deliveryRequest: DeliveryRequestDTO): Observable<DeliveryResponseDTO> {
    return this.http.put<DeliveryResponseDTO>(`${this.apiUrl}/deliveries/${id}`, deliveryRequest);
  }
  deleteDelivery(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deliveries/${id}`);
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
      `${this.apiUrl}/deliveries/customer/${customerId}`,
      { params },
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
      `${this.apiUrl}/deliveries/customer/${customerId}/active`,
      { params },
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
      `${this.apiUrl}/deliveries/customer/${customerId}/history`,
      { params },
    );
  }
  getSenderStats(customerId: string): Observable<SenderStatsDTO> {
    return this.http.get<SenderStatsDTO>(`${this.apiUrl}/deliveries/customer/${customerId}/stats`);
  }
}
