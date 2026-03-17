import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/api.page.model';
import {
  VehicleCreateDTO,
  VehicleResponseDTO,
  VehicleSearchFilter,
} from './vehicle.dto';
import { VerificationStatus } from '../../../core/models/models';

@Injectable({
  providedIn: 'root',
})
export class VehicleApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/vehicle`;

  /**
   * Create a new vehicle.
   * @param payload The vehicle creation data.
   */
  createVehicle(payload: VehicleCreateDTO): Observable<VehicleResponseDTO> {
    return this.http.post<VehicleResponseDTO>(this.apiUrl, payload);
  }

  /**
   * Fetch a single vehicle by id.
   * @param vehicleId The UUID of the vehicle.
   */
  getVehicleById(vehicleId: string): Observable<VehicleResponseDTO> {
    return this.http.get<VehicleResponseDTO>(`${this.apiUrl}/${vehicleId}`);
  }

  /**
   * Global/admin search over vehicles with filtering + pagination.
   * @param filter The search filter criteria.
   */
  searchVehicles(filter: VehicleSearchFilter): Observable<Page<VehicleResponseDTO>> {
    const params = this.buildHttpParams(filter);
    return this.http.get<Page<VehicleResponseDTO>>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Returns a paginated list of vehicles belonging to the current user.
   * @param page Page index (0-based).
   * @param size Page size.
   * @param sortBy Sort field.
   * @param sortDir Sort direction (ASC or DESC).
   */
  getMyVehicles(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'createdAt',
    sortDir: 'ASC' | 'DESC' = 'DESC'
  ): Observable<Page<VehicleResponseDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<Page<VehicleResponseDTO>>(`${this.apiUrl}/me`, { params });
  }

  /**
   * Get the active vehicle for the current user.
   */
  getMyActiveVehicle(): Observable<VehicleResponseDTO> {
    return this.http.get<VehicleResponseDTO>(`${this.apiUrl}/me/active`);
  }

  /**
   * Set a vehicle as active for the current user.
   * @param vehicleId The UUID of the vehicle to activate.
   */
  setActiveVehicle(vehicleId: string): Observable<VehicleResponseDTO> {
    return this.http.put<VehicleResponseDTO>(`${this.apiUrl}/${vehicleId}/active`, {});
  }

  /**
   * Verify a vehicle (Admin).
   * @param vehicleId The ID of the vehicle to verify.
   * @param request The verification status and optional rejection reason.
   */
  verifyVehicle(
    vehicleId: string,
    request: { status: VerificationStatus; rejectionReason?: string }
  ): Observable<VehicleResponseDTO> {
    return this.http.patch<VehicleResponseDTO>(
      `${this.apiUrl}/${vehicleId}/verify`,
      request
    );
  }

  /**
   * Helper method to build HttpParams from a filter object.
   */
  private buildHttpParams(filter: any): HttpParams {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}
