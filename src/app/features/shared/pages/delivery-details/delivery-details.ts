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
  CircleCheckBig,
  Play,
  RotateCcw,
} from 'lucide-angular';
import { interval, startWith, switchMap } from 'rxjs';
import { DeliveryResponseDTO } from '../../../sender/data-access/delivery.dto';
import { senderDeliveryActions } from '../../../sender/store/sender-delivery.actions';
import { selectSenderDeliveryState } from '../../../sender/store/sender-delivery.reducer';
import { courierDeliveryActions } from '../../../courier/store/courier-delivery.actions';
import { selectCourierDeliveryState } from '../../../courier/store/courier-delivery.reducer';
import { selectProfile } from '../../../profile/store/profile.reducer';
import { TrackingApiService, TrackingLogDTO } from '../../data-access/tracking.api.service';
import { GeolocationService } from '../../../../core/services/geoloaction.service';
import { Map as MapComponent } from '../map/map';
import { Role as UserRole, DeliveryStatus } from '../../../../core/models/models';
import { combineLatest } from 'rxjs';
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
  private trackingApi = inject(TrackingApiService);
  private geolocation = inject(GeolocationService);
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
  readonly CheckCircle = CircleCheckBig;
  readonly Play = Play;
  readonly Reset = RotateCcw;

  readonly Role = UserRole;
  readonly Status = DeliveryStatus;

  delivery: DeliveryResponseDTO | null = null;
  isLoading = false;
  routePoints: L.LatLng[] = [];
  trackingPoints: L.LatLng[] = [];
  userRole: string | null = null;
  currentUserId: string | null = null;

  ngOnInit() {
    // Dispatch load via ID
    if (this.id()) {
      this.store.dispatch(senderDeliveryActions.loadDelivery({ id: this.id() }));
    }

    // Listen to profile for role detection
    this.store
      .select(selectProfile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.userRole = profile?.role || null;
        this.currentUserId = profile?.id || null;
      });

    // Listen to delivery from either state
    combineLatest([
      this.store.select(selectSenderDeliveryState),
      this.store.select(selectCourierDeliveryState),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([senderState, courierState]) => {
        this.isLoading = senderState.isLoading || courierState.isLoading;

        const del =
          (courierState.delivery?.id === this.id() ? courierState.delivery : null) ||
          (senderState.delivery?.id === this.id() ? senderState.delivery : null);

        if (del) {
          const prevStatus = this.delivery?.status;
          this.delivery = del;

          // Initial Route (A -> B)
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

          // Handle Tracking based on status change or role
          if (this.delivery.status === 'IN_TRANSIT') {
            if (this.userRole === 'COURIER') {
              this.startCourierReporting();
            } else {
              this.startTrackingPolling();
            }
          }
        }
      });
  }

  updateStatus(status: DeliveryStatus) {
    if (this.delivery) {
      this.store.dispatch(
        courierDeliveryActions.updateDeliveryStatus({
          deliveryId: this.delivery.id,
          status,
        }),
      );
    }
  }

  private startCourierReporting() {
    // Report location every 10 seconds while on this page and status is IN_TRANSIT
    interval(10000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.geolocation.getPositionStream()),
      )
      .subscribe({
        next: (pos) => {
          this.trackingApi
            .createLog({
              deliveryId: this.id(),
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            })
            .subscribe();
        },
        error: (err) => console.error('Tracking Error:', err),
      });
  }

  private startTrackingPolling() {
    // Poll for tracking history every 10 seconds for Senders/Admins
    interval(10000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(() => this.trackingApi.getHistory(this.id())),
      )
      .subscribe((logs) => {
        this.trackingPoints = logs
          .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())
          .map((log) => L.latLng(log.lat, log.lon));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
