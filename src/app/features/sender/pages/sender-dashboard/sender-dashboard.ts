import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Box,
  Clock,
  Home,
  MapPin,
  BadgeCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../profile/store/profile.reducer';
import { senderDeliveryActions } from '../../store/sender-delivery.actions';
import { selectSenderDeliveryState } from '../../store/sender-delivery.reducer';
import { Subject, takeUntil, map, filter } from 'rxjs';
import { DeliveryStatus } from '../../../../core/models/models';

@Component({
  selector: 'app-sender-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './sender-dashboard.html',
})
export class SenderDashboardComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Icons
  readonly Box = Box;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly BadgeCheck = BadgeCheck;
  readonly TrendingUp = TrendingUp;
  readonly ArrowRight = ArrowRight;
  readonly Home = Home;

  // Real data state
  statsData: any = null;
  activeDeliveries: any[] = [];
  isLoading = false;

  // Presentation structure for stats
  stats = [
    {
      key: 'active',
      label: 'Active Deliveries',
      value: '0',
      icon: Box,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      key: 'spent',
      label: 'Total Spent',
      value: '0 DH',
      icon: TrendingUp,
      color: 'text-uni-500',
      bg: 'bg-uni-500/10',
      border: 'border-uni-500/20',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: '0',
      icon: BadgeCheck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  ngOnInit() {
    // 1. Get Logged In User
    this.store
      .select(selectProfile)
      .pipe(
        takeUntil(this.destroy$),
        filter((profile) => !!profile),
      )
      .subscribe((profile) => {
        // 2. Dispatch data load using their ID
        if (profile) {
          this.store.dispatch(senderDeliveryActions.loadSenderStats({ customerId: profile.id }));
          // Request page 0, size 5 for the dashboard preview
          this.store.dispatch(
            senderDeliveryActions.loadActiveDeliveries({
              customerId: profile.id,
              page: 0,
              size: 5,
            }),
          );
        }
      });

    // 3. Listen to State changes
    this.store
      .select(selectSenderDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isLoading = state.isLoading;

        // Map API Stats Data
        if (state.stats) {
          this.statsData = state.stats;
          this.updateStatsDisplay();
        }

        // Map Active Deliveries List
        if (state.deliveries && state.deliveries.content) {
          this.activeDeliveries = state.deliveries.content;
        }
      });
  }

  updateStatsDisplay() {
    if (!this.statsData) return;

    this.stats = [
      {
        key: 'active',
        label: 'Active Deliveries',
        value: `${this.statsData.activeDeliveries || 0}`,
        icon: Box,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
      },
      {
        key: 'spent',
        label: 'Total Spent',
        value: `${this.statsData.totalSpent || 0} DH`,
        icon: TrendingUp,
        color: 'text-uni-500',
        bg: 'bg-uni-500/10',
        border: 'border-uni-500/20',
      },
      {
        key: 'completed',
        label: 'Completed',
        value: `${this.statsData.completedDeliveries || 0}`,
        icon: BadgeCheck,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
      },
    ];
  }

  getStatusColor(status: string | DeliveryStatus): string {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'PICKED_UP':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'IN_TRANSIT':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'DELIVERED':
        return 'text-uni-500 bg-uni-500/10 border-uni-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  }

  formatLabel(status: string | DeliveryStatus): string {
    return status?.toString().replace('_', ' ') || 'Unknown';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
