import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { adminDeliveryActions } from '../../store/admin-delivery.actions';
import { selectStats, selectIsLoading } from '../../store/admin-delivery.reducer';
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

  // NgRx State
  stats = this.store.selectSignal(selectStats);
  isLoading = this.store.selectSignal(selectIsLoading);

  ngOnInit() {
    this.store.dispatch(adminDeliveryActions.loadAdminStats());
  }

  // Mock Verifications
  recentVerifs = [
    {
      id: '#DOC-1023',
      user: 'Karim B.',
      type: IdentityType.CIN,
      status: VerificationStatus.PENDING,
      date: '2 min ago',
    },
    {
      id: '#DOC-1022',
      user: 'Sara K.',
      type: 'Vehicle',
      status: VerificationStatus.APPROVED,
      date: '15 min ago',
    },
    {
      id: '#DOC-1021',
      user: 'Ahmed R.',
      type: IdentityType.DRIVERS_LICENSE,
      status: VerificationStatus.REJECTED,
      date: '1 hr ago',
    },
    {
      id: '#DOC-1020',
      user: 'Lina M.',
      type: IdentityType.PASSPORT,
      status: VerificationStatus.APPROVED,
      date: '2 hrs ago',
    },
  ];
}
