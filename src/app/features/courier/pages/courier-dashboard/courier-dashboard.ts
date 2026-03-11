import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Box,
  MapPin,
  TrendingUp,
  ArrowRight,
  Car,
  Navigation,
  CheckCircle2,
  DollarSign,
  Star,
  Activity,
} from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../profile/store/profile.reducer';
import { courierDeliveryActions } from '../../store/courier-delivery.actions';
import { Subject, takeUntil, filter } from 'rxjs';
import { DeliveryStatus } from '../../../../core/models/models';
import { CourierStatsDTO } from '../../data-access/courier-delivery.dto';
import { DeliveryResponseDTO } from '../../../sender/data-access/delivery.dto';
import { selectCourierDeliveryState } from '../../store/courier-delivery.reducer';

@Component({
  selector: 'app-courier-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './courier-dashboard.html',
})
export class CourierDashboardComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Icons
  readonly Box = Box;
  readonly MapPin = MapPin;
  readonly TrendingUp = TrendingUp;
  readonly ArrowRight = ArrowRight;
  readonly Car = Car;
  readonly Navigation = Navigation;
  readonly CheckCircle2 = CheckCircle2;
  readonly DollarSign = DollarSign;
  readonly Star = Star;
  readonly Activity = Activity;

  // Real data state
  statsData: CourierStatsDTO | null = null;
  activeDelivery: DeliveryResponseDTO | null = null;
  isLoading = false;

  // Presentation structure for stats
  stats = [
    {
      key: 'earnings',
      label: 'Total Earnings',
      value: '0 DH',
      icon: DollarSign,
      color: 'text-uni-500',
      bg: 'bg-uni-500/10',
      border: 'border-uni-500/20',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: '0',
      icon: CheckCircle2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      key: 'rating',
      label: 'Avg Rating',
      value: '0.0',
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ];

  ngOnInit() {
    this.store
      .select(selectProfile)
      .pipe(
        takeUntil(this.destroy$),
        filter((profile) => !!profile),
      )
      .subscribe((profile) => {
        if (profile) {
          // Load Stats
          this.store.dispatch(courierDeliveryActions.loadCourierStats({ driverId: profile.id }));

          // Load Active Delivery (if they are currently on a job)
          this.store.dispatch(courierDeliveryActions.loadActiveDelivery({ driverId: profile.id }));
        }
      });

    this.store
      .select(selectCourierDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isLoading = state.isLoading;

        if (state.stats) {
          this.statsData = state.stats;
          this.updateStatsDisplay();
        }

        // The active delivery object
        this.activeDelivery = state.delivery;
      });
  }

  updateStatsDisplay() {
    if (!this.statsData) return;

    this.stats = [
      {
        key: 'earnings',
        label: 'Total Earnings',
        value: `${this.statsData.totalEarnings || 0} DH`,
        icon: DollarSign,
        color: 'text-uni-500',
        bg: 'bg-uni-500/10',
        border: 'border-uni-500/20',
      },
      {
        key: 'completed',
        label: 'Completed',
        value: `${this.statsData.totalCompletedDeliveries || 0}`,
        icon: CheckCircle2,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
      },
      {
        key: 'rating',
        label: 'Avg Rating',
        value: `${this.statsData.averageRating?.toFixed(1) || '0.0'}`,
        icon: Star,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
      },
    ];
  }

  getStatusColor(status: string | DeliveryStatus): string {
    switch (status) {
      case 'CREATED':
      case 'PENDING':
      case 'MATCHED':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'ACCEPTED':
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'DELIVERED':
        return 'text-uni-500 bg-uni-500/10 border-uni-500/20';
      case 'CANCELLED':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  }

  formatLabel(status: string | DeliveryStatus): string {
    return status?.toString().replace(/_/g, ' ') || 'Unknown';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
