import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/api.page.model';
import {
  VehicleCreateDTO,
  VehicleResponseDTO,
  VehicleSearchFilter,
} from './vehicle.dto';
import { VerificationStatus } from '../../../core/models/models';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/vehicle`;
  private toast = inject(ToastService);

  private mapVehicleImage(vehicle: VehicleResponseDTO): VehicleResponseDTO {
    if (vehicle && vehicle.imageUrl && !vehicle.imageUrl.startsWith('http')) {
      // Mapping raw static directory endpoints to the Vehicle Microservice Port bindings
      vehicle.imageUrl = `http://localhost:8083${vehicle.imageUrl}`;
    }
    return vehicle;
  }

  private mapPageImages(page: Page<VehicleResponseDTO>): Page<VehicleResponseDTO> {
    if (page && page.content) {
      page.content = page.content.map(v => this.mapVehicleImage(v));
    }
    return page;
  }

  /**
   * Create a new vehicle.
   * @param payload The vehicle creation data including optional image.
   */
  createVehicle(payload: VehicleCreateDTO): Observable<VehicleResponseDTO> {
    const formData = new FormData();
    formData.append('ownerId', payload.ownerId);
    formData.append('type', payload.type);
    formData.append('model', payload.model);
    formData.append('plateNumber', payload.plateNumber);
    if (payload.color) {
      formData.append('color', payload.color);
    }
    if (payload.image) {
      // Image must be a Blob/File. The backend expects 'image'.
      formData.append('image', payload.image as Blob);
    }

    // Pass FormData directly; HttpClient automatically sets Content-Type to multipart/form-data.
    return this.http.post<VehicleResponseDTO>(this.apiUrl, formData).pipe(
      map(v => this.mapVehicleImage(v)),
      tap(() => this.toast.show('Véhicule créé avec succès', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de création', error.error?.message || 'Impossible de créer le véhicule');
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch a single vehicle by id.
   * @param vehicleId The UUID of the vehicle.
   */
  getVehicleById(vehicleId: string): Observable<VehicleResponseDTO> {
    return this.http.get<VehicleResponseDTO>(`${this.apiUrl}/${vehicleId}`).pipe(
      map(v => this.mapVehicleImage(v)),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger le véhicule');
        return throwError(() => error);
      })
    );
  }

  /**
   * Global/admin search over vehicles with filtering + pagination.
   * @param filter The search filter criteria.
   */
  searchVehicles(filter: VehicleSearchFilter): Observable<Page<VehicleResponseDTO>> {
    const params = this.buildHttpParams(filter);
    return this.http.get<Page<VehicleResponseDTO>>(`${this.apiUrl}/search`, { params }).pipe(
      map(page => this.mapPageImages(page)),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de rechercher les véhicules');
        return throwError(() => error);
      })
    );
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
    return this.http.get<Page<VehicleResponseDTO>>(`${this.apiUrl}/me`, { params }).pipe(
      map(page => this.mapPageImages(page)),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger vos véhicules');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get the active vehicle for the current user.
   */
  getMyActiveVehicle(): Observable<VehicleResponseDTO> {
    return this.http.get<VehicleResponseDTO>(`${this.apiUrl}/me/active`).pipe(
      map(v => this.mapVehicleImage(v)),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Set a vehicle as active for the current user.
   * @param vehicleId The UUID of the vehicle to activate.
   */
  setActiveVehicle(vehicleId: string): Observable<VehicleResponseDTO> {
    return this.http.put<VehicleResponseDTO>(`${this.apiUrl}/${vehicleId}/active`, {}).pipe(
      map(v => this.mapVehicleImage(v)),
      tap(() => this.toast.show('Véhicule activé', 'success')),
      catchError((error) => {
        this.toast.showError("Erreur d'activation", error.error?.message || "Impossible d'activer le véhicule");
        return throwError(() => error);
      })
    );
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
    ).pipe(
      map(v => this.mapVehicleImage(v)),
      tap(() => this.toast.show('Véhicule vérifié', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur de vérification', error.error?.message || 'Impossible de vérifier le véhicule');
        return throwError(() => error);
      })
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
