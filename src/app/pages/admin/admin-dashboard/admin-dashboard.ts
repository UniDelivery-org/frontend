import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimationService } from '../../../services/animation';
import { VerificationStatus, IdentityType } from '../../../core/models/models';
import { LucideAngularModule, Search, Bell, Menu, Users, Bike, FileText, Wallet, ArrowUpRight, CheckCircle, XCircle, Clock, MoreHorizontal, Download } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements AfterViewInit {
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

  // Expose Enum
  readonly VerificationStatus = VerificationStatus;

  @ViewChildren('statCard') statCards!: QueryList<ElementRef>;
  @ViewChildren('tableRow') tableRows!: QueryList<ElementRef>;

  constructor(private animService: AnimationService) {}

  ngAfterViewInit() {
    this.animService.staggerFadeIn(this.statCards.map(c => c.nativeElement), 0.1);
    this.animService.staggerFadeIn(this.tableRows.map(c => c.nativeElement), 0.5);
  }

  // Stats Data
  stats = [
    { title: 'Total Users', value: '12,345', change: '+12%', icon: Users },
    { title: 'Active Couriers', value: '432', change: '+5%', icon: Bike },
    { title: 'Pending Docs', value: '18', change: '-2', icon: FileText },
    { title: 'Today Earnings', value: '45k DH', change: '+18%', icon: Wallet },
  ];

  // Mock Verifications
  recentVerifs = [
    { id: '#DOC-1023', user: 'Karim B.', type: IdentityType.CIN, status: VerificationStatus.PENDING, date: '2 min ago' },
    { id: '#DOC-1022', user: 'Sara K.', type: 'Vehicle', status: VerificationStatus.APPROVED, date: '15 min ago' },
    { id: '#DOC-1021', user: 'Ahmed R.', type: IdentityType.DRIVERS_LICENSE, status: VerificationStatus.REJECTED, date: '1 hr ago' },
    { id: '#DOC-1020', user: 'Lina M.', type: IdentityType.PASSPORT, status: VerificationStatus.APPROVED, date: '2 hrs ago' },
  ];
}
