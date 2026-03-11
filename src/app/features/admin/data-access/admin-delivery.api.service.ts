import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../shared/models/api.page.model';
import { environment } from '../../../../environments/environment';
import { AdminStatsDTO } from './admin-stats.dto';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { DeliveryStatus } from '../../../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class AdminDeliveryApiService {
  private baseUrl = environment.apiUrl;
  private apiVersion = environment.apiVersion;
  private apiUrl = `${this.baseUrl}/${this.apiVersion}/delivery`;

  constructor(private http: HttpClient) {}

  getAllDeliveries(
    status?: DeliveryStatus,
    page: number = 0,
    size: number = 10,
  ): Observable<Page<DeliveryResponseDTO>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Page<DeliveryResponseDTO>>(`${this.apiUrl}/admin`, { params });
  }

  forceCancelDelivery(deliveryId: string, reason: string): Observable<DeliveryResponseDTO> {
    return this.http.put<DeliveryResponseDTO>(`${this.apiUrl}/admin/${deliveryId}/cancel`, reason);
  }

  getAdminStats(): Observable<AdminStatsDTO> {
    return this.http.get<AdminStatsDTO>(`${this.apiUrl}/admin/stats`);
  }
}
