import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { StripeIntentRequestDTO, StripeIntentResponseDTO } from './payment.dto';

@Injectable({
  providedIn: 'root'
})
export class StripeApiService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/transactions/stripe`;

  /**
   * Initializes a secure Stripe payment session.
   * @param request Payload containing the walletId and amount in cents.
   */
  createPaymentIntent(request: StripeIntentRequestDTO): Observable<StripeIntentResponseDTO> {
    return this.http.post<StripeIntentResponseDTO>(`${this.apiUrl}/intent`, request).pipe(
      catchError((error) => {
        this.toast.showError('Erreur de paiement', error.error?.message || 'Erreur lors de la communication avec Stripe');
        return throwError(() => error);
      })
    );
  }
}
