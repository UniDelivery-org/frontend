import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { WalletResponseDTO } from './payment.dto';

@Injectable({
  providedIn: 'root'
})
export class WalletApiService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/wallets`;

  /**
   * Retrieves the current state of a user's wallet.
   * @param ownerId The ID of the wallet owner.
   */
  getWallet(ownerId: string): Observable<WalletResponseDTO> {
    return this.http.get<WalletResponseDTO>(`${this.apiUrl}`).pipe(
      catchError((error) => {
        if (error.status !== 404) {
          this.toast.showError('Erreur', error.error?.message || 'Impossible de charger le portefeuille');
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Creates a new, empty wallet for a user.
   * @param ownerId The ID of the wallet owner.
   */
  initializeWallet(ownerId: string): Observable<WalletResponseDTO> {
    return this.http.post<WalletResponseDTO>(`${this.apiUrl}`, {}).pipe(
      tap(() => this.toast.show('Portefeuille initialisé avec succès', 'success')),
      catchError((error) => {
        this.toast.showError("Erreur d'initialisation", error.error?.message || "Impossible d'initialiser le portefeuille");
        return throwError(() => error);
      })
    );
  }
}
