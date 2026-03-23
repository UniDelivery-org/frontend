import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectClientSecret } from '../store/payment.reducer';
import { paymentActions } from '../store/payment.actions';
import { selectProfile } from '../../profile/store/profile.reducer';
import { take } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, CreditCard, X } from 'lucide-angular';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './payment.html'
})
export class PaymentPageComponent implements OnInit {
  readonly CreditCard = CreditCard;
  readonly X = X;

  private store = inject(Store);
  private router = inject(Router);
  private toast = inject(ToastService);

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  
  isInitializing = true;
  isConfirmingPayment = false;

  ngOnInit() {
    this.store.select(selectClientSecret).pipe(take(1)).subscribe(async secret => {
      if (!secret) {
        this.toast.showError('Erreur de session', 'Aucun paiement en attente. Redirection vers le portefeuille.');
        this.router.navigate(['/wallet']);
        return;
      }

      this.stripe = await loadStripe(environment.stripePublicKey);
      if (!this.stripe) {
        this.toast.showError('Erreur système', 'Impossible de charger Stripe.');
        return;
      }

      this.elements = this.stripe.elements({ 
        clientSecret: secret, 
        appearance: { theme: 'night', variables: { colorPrimary: '#65d654', colorBackground: '#1f1f1f', colorText: '#ffffff' } } 
      });

      // Mount the element
      setTimeout(() => {
        const paymentElement = this.elements!.create('payment');
        paymentElement.mount('#payment-element');
        
        // Hide loader once mounted
        paymentElement.on('ready', () => {
          this.isInitializing = false;
        });
      }, 50);
    });
  }

  cancelPayment() {
    this.router.navigate(['/wallet']);
  }

  async confirmPayment() {
    if (!this.stripe || !this.elements) return;

    this.isConfirmingPayment = true;
    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: window.location.origin + '/wallet', 
      },
      redirect: 'if_required' 
    });

    this.isConfirmingPayment = false;

    if (error) {
      this.toast.showError('Paiement échoué', error.message || 'Une erreur est survenue');
    } else {
      this.toast.show('Paiement réussi!', 'success');
      
      this.store.select(selectProfile).pipe(take(1)).subscribe(profile => {
        if(profile) this.store.dispatch(paymentActions.loadWallet({ ownerId: profile.id }));
      });

      this.router.navigate(['/wallet']);
    }
  }
}
