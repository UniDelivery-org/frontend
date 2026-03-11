import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Box,
  MapPin,
  ArrowRight,
  Power,
  Activity,
  Filter,
  Map as MapIcon,
  X,
  Truck,
  Scale,
  Bike,
  Car,
} from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../profile/store/profile.reducer';
import { profileActions } from '../../../profile/store/profile.actions';
import { courierDeliveryActions } from '../../store/courier-delivery.actions';
import { selectCourierDeliveryState } from '../../store/courier-delivery.reducer';
import { Subject, takeUntil, filter } from 'rxjs';
import { DeliveryResponseDTO } from '../../../sender/data-access/delivery.dto';
import { CourierDeliveryState } from '../../store/courier-delivery.state';
import * as L from 'leaflet';
import { Map } from '../../../shared/pages/map/map';

@Component({
  selector: 'app-available-jobs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Map],
  templateUrl: './available-jobs.html',
})
export class AvailableJobsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Icons
  readonly Box = Box;
  readonly MapPin = MapPin;
  readonly ArrowRight = ArrowRight;
  readonly Power = Power;
  readonly Activity = Activity;
  readonly Filter = Filter;

  // State
  isLoading = false;
  isOnline = false;
  filterMode: 'all' | 'nearby' = 'all'; // 'all' fetches pending, 'nearby' fetches nearby
  driverId: string | null = null;
  jobs: DeliveryResponseDTO[] = [];
  searchRadius = 50; // Dynamic search radius in km
  isDraggingRadius = false;

  // Map Modal State
  selectedJobForMap: DeliveryResponseDTO | null = null;
  mapRoutePoints: L.LatLng[] = [];

  readonly MapIcon = MapIcon;
  readonly X = X;
  readonly Truck = Truck;
  readonly Scale = Scale;
  readonly Bike = Bike;
  readonly Car = Car;

  ngOnInit() {
    this.store
      .select(selectProfile)
      .pipe(
        takeUntil(this.destroy$),
        filter((profile) => !!profile),
      )
      .subscribe((profile) => {
        if (profile) {
          this.driverId = profile.id;

          // Only react if the profile state implies we are online and we haven't tracked it yet
          if (profile.isOnline && !this.isOnline) {
            this.isOnline = true;
            this.fetchJobs();
          } else if (!profile.isOnline && this.isOnline) {
            this.isOnline = false;
            this.jobs = [];
          }
        }
      });

    this.store
      .select(selectCourierDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isLoading = state.isLoading;

        if (
          this.filterMode === 'all' &&
          state.pendingDeliveries &&
          state.pendingDeliveries.content
        ) {
          this.jobs = state.pendingDeliveries.content;
        } else if (
          this.filterMode === 'nearby' &&
          state.nearbyDeliveries &&
          state.nearbyDeliveries.content
        ) {
          this.jobs = state.nearbyDeliveries.content;
        }
      });
  }

  toggleOnlineStatus() {
    const newStatus = !this.isOnline;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.store.dispatch(
            profileActions.updateProfile({
              updateProfileDto: {
                isOnline: newStatus,
                currentLat: position.coords.latitude,
                currentLon: position.coords.longitude,
              },
            }),
          );
        },
        (error) => {
          console.warn('Geolocation blocked or failed. Updating status without location.', error);
          this.store.dispatch(
            profileActions.updateProfile({
              updateProfileDto: { isOnline: newStatus },
            }),
          );
        },
      );
    } else {
      this.store.dispatch(
        profileActions.updateProfile({
          updateProfileDto: { isOnline: newStatus },
        }),
      );
    }
  }

  setFilterMode(mode: 'all' | 'nearby') {
    if (this.filterMode === mode) return;
    this.filterMode = mode;
    this.jobs = []; // Clear list until new one finishes loading
    if (this.isOnline) {
      this.fetchJobs();
    }
  }

  onRadiusInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchRadius = Number(input.value);
  }

  onRadiusChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchRadius = Number(input.value);

    // Only fetch automatically if we are in 'nearby' mode and online
    if (this.isOnline && this.filterMode === 'nearby') {
      this.fetchJobs();
    }
  }

  fetchJobs() {
    if (!this.driverId) return;

    if (this.filterMode === 'all') {
      this.store.dispatch(courierDeliveryActions.loadPendingDeliveries({ page: 0, size: 20 }));
    } else {
      this.store.dispatch(
        courierDeliveryActions.loadNearbyDeliveries({
          driverId: this.driverId,
          radius: this.searchRadius,
          page: 0,
          size: 20,
        }),
      );
    }
  }

  acceptOpportunity(deliveryId: string) {
    if (!this.driverId) return;
    // Dispatch accept action
    this.store.dispatch(
      courierDeliveryActions.acceptDelivery({ deliveryId, driverId: this.driverId }),
    );
  }

  // --- Map Modal Logic ---
  openMap(job: DeliveryResponseDTO) {
    this.selectedJobForMap = job;
    this.mapRoutePoints = [
      L.latLng(job.pickupLat, job.pickupLon),
      L.latLng(job.dropoffLat, job.dropoffLon),
    ];
  }

  closeMap() {
    this.selectedJobForMap = null;
    this.mapRoutePoints = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
