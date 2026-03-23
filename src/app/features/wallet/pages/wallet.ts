import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wallet, ArrowUpRight, ArrowDownLeft, Plus, Nfc, History } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../profile/store/profile.reducer';
import { paymentActions } from '../../payment/store/payment.actions';
import { selectWallet, selectTransactions, selectIsLoading, selectClientSecret } from '../../payment/store/payment.reducer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap, take } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './wallet.html'
})
export class WalletComponent {
  // Icons
  readonly Wallet = Wallet;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownLeft = ArrowDownLeft;
  readonly Plus = Plus;
  readonly Nfc = Nfc;
  readonly History = History;

  private store = inject(Store);
  private toast = inject(ToastService);
  private router = inject(Router);

  wallet$ = this.store.select(selectWallet);
  transactions$ = this.store.select(selectTransactions);
  isLoading$ = this.store.select(selectIsLoading);
  clientSecret$ = this.store.select(selectClientSecret);

  constructor() {
    // Load wallet when profile is available
    this.store.select(selectProfile).pipe(
      takeUntilDestroyed(),
      filter(profile => !!profile),
      tap(profile => {
        this.store.dispatch(paymentActions.loadWallet({ ownerId: profile!.id }));
      })
    ).subscribe();

    // Load transactions when wallet is successfully loaded
    this.wallet$.pipe(
      takeUntilDestroyed(),
      filter(wallet => !!wallet),
      tap(wallet => {
        this.store.dispatch(paymentActions.loadTransactions({ walletId: wallet!.id }));
      })
    ).subscribe();
  }

  initializeWallet() {
    this.store.select(selectProfile).pipe(
      filter(profile => !!profile),
      take(1),
      tap(profile => {
        this.store.dispatch(paymentActions.initializeWallet({ ownerId: profile!.id }));
      })
    ).subscribe();
  }

  async addFunds() {
    this.wallet$.pipe(take(1)).subscribe(async wallet => {
      if (!wallet) return;

      const result = await this.toast.promptNumber(
        'Recharger le portefeuille', 
        'Montant en UniCoins (ex: 500)', 
        'Continuer vers le paiement'
      );

      if (result.isConfirmed && result.value) {
        const amountInCents = Math.round(Number(result.value) * 100);
        
        if (amountInCents > 0) {
          this.store.dispatch(paymentActions.createPaymentIntent({
            request: {
              walletId: wallet.id,
              amountInCents
            }
          }));
          
          this.toast.show('Initialisation Stripe en cours...', 'info');

          // Await Client Secret from Redux
          this.clientSecret$.pipe(
            filter(secret => !!secret),
            take(1)
          ).subscribe(() => {
            this.router.navigate(['/payment']);
          });
        } else {
          this.toast.showError('Montant invalide', 'Veuillez entrer un montant supérieur à 0.');
        }
      }
    });
  }

  withdrawFunds() {
    this.toast.show('Fonctionnalité de retrait bientôt disponible', 'info');
  }
}