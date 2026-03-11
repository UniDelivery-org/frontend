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
import { courierDeliveryActions } from '../../courier/store/courier-delivery.actions';
import { selectCourierDeliveryState } from '../../courier/store/courier-delivery.reducer';
import { Subject, takeUntil, filter, combineLatest } from 'rxjs';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { AppState } from '../../../shared/models/app.state';
import { UserRole } from '../../shared/enums/user.enums';

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

  userId = '';
  userRole: UserRole | null = null;
  Role = UserRole;

  constructor(private store: Store<AppState>) {}

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
          this.userId = profile.id;
          this.userRole = profile.role;
          this.loadHistory();
        }
      });

    // 2. Listen to History State depending on role
    this.store
      .select(selectSenderDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        if (this.userRole === UserRole.SENDER && state) {
          this.isLoading = state.isLoading;
          if (state.deliveries) {
            this.activities = state.deliveries.content;
            this.currentPage = state.deliveries.number;
            this.totalPages = state.deliveries.totalPages;
            this.totalElements = state.deliveries.totalElements;
          }
        }
      });

    this.store
      .select(selectCourierDeliveryState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        if (this.userRole === UserRole.COURIER && state) {
          this.isLoading = state.isLoading;
          // Courier history is stored in state.history, whereas sender history is in state.deliveries
          if (state.history) {
            this.activities = state.history.content;
            this.currentPage = state.history.number;
            this.totalPages = state.history.totalPages;
            this.totalElements = state.history.totalElements;
          }
        }
      });
  }

  loadHistory() {
    if (!this.userRole || !this.userId) return;

    if (this.userRole === UserRole.SENDER) {
      this.store.dispatch(
        senderDeliveryActions.loadDeliveryHistory({
          customerId: this.userId,
          page: this.currentPage,
          size: this.pageSize,
        }),
      );
    } else if (this.userRole === UserRole.COURIER) {
      this.store.dispatch(
        courierDeliveryActions.loadDeliveryHistory({
          driverId: this.userId,
          page: this.currentPage,
          size: this.pageSize,
        }),
      );
    }
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
