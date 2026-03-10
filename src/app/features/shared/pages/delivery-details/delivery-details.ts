import { Component, input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import {
  LucideAngularModule,
  MapPin,
  Navigation,
  Package,
  Banknote,
  ArrowLeft,
  FileText,
  Clock,
  Route,
} from 'lucide-angular';
import { DeliveryResponseDTO } from '../../../sender/data-access/delivery.dto';
import { senderDeliveryActions } from '../../../sender/store/sender-delivery.actions';
import { selectSenderDeliveryState } from '../../../sender/store/sender-delivery.reducer';
import { Map as MapComponent } from '../map/map';
import * as L from 'leaflet';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, MapComponent],
  templateUrl: './delivery-details.html',
})
export class DeliveryDetailsComponent implements OnInit, OnDestroy {
  id = input.required<string>(); // Next.js/Angular17 style router inputs automatically pass URL params
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Icons
  readonly MapPin = MapPin;
  readonly Navigation = Navigation;
  readonly Package = Package;
  readonly Banknote = Banknote;
  readonly ArrowLeft = ArrowLeft;
  readonly FileText = FileText;
  readonly Clock = Clock;
  readonly Route = Route;

  delivery: DeliveryResponseDTO | null = null;
  isLoading = false;
  routePoints: L.LatLng[] = [];

  ngOnInit() {
    // Dispatch load via ID
    if (this.id()) {
      this.store.dispatch(senderDeliveryActions.loadDelivery({ id: this.id() }));
    }

    // Listen to the single delivery state
    this.store
      .select(selectSenderDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isLoading = state.isLoading;
        if (state.delivery && state.delivery.id === this.id()) {
          this.delivery = state.delivery;
          if (
            this.delivery.pickupLat &&
            this.delivery.pickupLon &&
            this.delivery.dropoffLat &&
            this.delivery.dropoffLon
          ) {
            this.routePoints = [
              L.latLng(this.delivery.pickupLat, this.delivery.pickupLon),
              L.latLng(this.delivery.dropoffLat, this.delivery.dropoffLon),
            ];
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
