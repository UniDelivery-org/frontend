import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { TransactionResponseDTO, TransactionRequestDTO } from './payment.dto';

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/transactions`;

  /**
   * Retrieves a chronologically ordered list of transactions for a specific wallet.
   * @param walletId The ID of the wallet.
   */
  getWalletTransactions(walletId: string): Observable<TransactionResponseDTO[]> {
    return this.http.get<TransactionResponseDTO[]>(`${this.apiUrl}/wallet/${walletId}`).pipe(
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les transactions');
        return throwError(() => error);
      })
    );
  }

  /**
   * Manually records a transaction. Primarily for internal system use.
   * @param request The transaction request details.
   */
  recordTransaction(request: TransactionRequestDTO): Observable<TransactionResponseDTO> {
    return this.http.post<TransactionResponseDTO>(this.apiUrl, request).pipe(
      tap(() => this.toast.show('Transaction enregistrée', 'success')),
      catchError((error) => {
        this.toast.showError("Erreur d'enregistrement", error.error?.message || "Impossible d'enregistrer la transaction");
        return throwError(() => error);
      })
    );
  }
}
