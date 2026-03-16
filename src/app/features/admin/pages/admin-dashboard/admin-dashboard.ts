import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { adminDeliveryActions } from '../../store/admin-delivery.actions';
import { selectStats, selectIsLoading as selectIsStatsLoading } from '../../store/admin-delivery.reducer';
import {
  LucideAngularModule,
  Users,
  Bike,
  FileText,
  Wallet,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Download,
  Activity,
  Package,
} from 'lucide-angular';
import { VerificationStatus, IdentityType } from '../../../../core/models/models';
import { identityVerificationActions } from '../../../identity-verifications/store/identity-verification.actions';
import {
  selectDocuments,
  selectIsLoading as selectIsVerifsLoading,
  selectTotalElements,
} from '../../../identity-verifications/store/identity-verification.reducer';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboardComponent implements OnInit {
  private store = inject(Store);
  // Icons
  readonly Users = Users;
  readonly Bike = Bike;
  readonly FileText = FileText;
  readonly Wallet = Wallet;
  readonly ArrowUpRight = ArrowUpRight;
  readonly MoreHorizontal = MoreHorizontal;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Clock = Clock;
  readonly Download = Download;
  readonly Activity = Activity;
  readonly Package = Package;

  // Expose Enum
  readonly VerificationStatus = VerificationStatus;
  readonly IdentityType = IdentityType;

  // NgRx State - Stats
  stats = this.store.selectSignal(selectStats);
  isLoadingStats = this.store.selectSignal(selectIsStatsLoading);

  // NgRx State - Verifications
  verifications = this.store.selectSignal(selectDocuments);
  isVerifsLoading = this.store.selectSignal(selectIsVerifsLoading);
  totalVerifs = this.store.selectSignal(selectTotalElements);

  currentPage = 0;
  pageSize = 5;

  ngOnInit() {
    this.store.dispatch(adminDeliveryActions.loadAdminStats());
    this.loadVerifications();
  }

  loadVerifications() {
    this.store.dispatch(
      identityVerificationActions.loadAllDocuments({
        filter: {
          page: this.currentPage,
          size: this.pageSize,
        },
      }),
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadVerifications();
  }
}
