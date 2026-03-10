import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Package,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../profile/store/profile.reducer';
import { senderDeliveryActions } from '../../sender/store/sender-delivery.actions';
import { selectSenderDeliveryState } from '../../sender/store/sender-delivery.reducer';
import { Subject, takeUntil, filter } from 'rxjs';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { AppState } from '../../../shared/models/app.state';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './activity.html',
})
export class ActivityComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Icons
  readonly Package = Package;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly ChevronRight = ChevronRight;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  activities: DeliveryResponseDTO[] = [];
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  customerId = '';

  constructor(private store: Store) {}

  ngOnInit() {
    // 1. Get User Profile ID
    this.store
      .select(selectProfile)
      .pipe(
        takeUntil(this.destroy$),
        filter((profile) => !!profile),
      )
      .subscribe((profile: any) => {
        if (profile) {
          this.customerId = profile.id;
          this.loadHistory();
        }
      });

    // 2. Listen to History State
    this.store
      .select(selectSenderDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        this.isLoading = state.isLoading;

        if (state.deliveries) {
          this.activities = state.deliveries.content;
          this.currentPage = state.deliveries.number;
          this.totalPages = state.deliveries.totalPages;
          this.totalElements = state.deliveries.totalElements;
        }
      });
  }

  loadHistory() {
    this.store.dispatch(
      senderDeliveryActions.loadDeliveryHistory({
        customerId: this.customerId,
        page: this.currentPage,
        size: this.pageSize,
      }),
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadHistory();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadHistory();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
