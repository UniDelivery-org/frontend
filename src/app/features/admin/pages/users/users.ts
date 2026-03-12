import { Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Search,
  Shield,
  User as UserIcon,
  Mail,
  Ban,
  Trash2,
  Bike,
  Package,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  EllipsisVertical,
  Funnel,
} from 'lucide-angular';
import { User, Role } from '../../../../core/models/models';
import { Store } from '@ngrx/store';
import { adminUserActions } from '../../store/admin-users.actions';
import { selectUsersPage, selectIsLoading } from '../../store/admin-users.reducer';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private store = inject(Store);

  // Icons
  readonly Search = Search;
  readonly Filter = Funnel;
  readonly MoreVertical = EllipsisVertical;
  readonly Shield = Shield;
  readonly User = UserIcon;
  readonly Mail = Mail;
  readonly CheckCircle = CircleCheckBig;
  readonly XCircle = CircleX;
  readonly AlertCircle = CircleAlert;
  readonly Ban = Ban;
  readonly Trash2 = Trash2;
  readonly Bike = Bike;
  readonly Package = Package;
  readonly Role = Role;

  usersPage = this.store.selectSignal(selectUsersPage);
  isLoading = this.store.selectSignal(selectIsLoading);
  currentPage = 0;
  searchQuery = '';
  selectedRole: Role | undefined = undefined;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.store.dispatch(
      adminUserActions.loadAllUsers({
        page: this.currentPage,
        size: 10,
        search: this.searchQuery || undefined,
        role: this.selectedRole,
      }),
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    this.currentPage = 0; // Reset to first page on search
    this.loadUsers();
  }

  onFilter(role: Role | 'ALL') {
    this.selectedRole = role === 'ALL' ? undefined : role;
    this.currentPage = 0; // Reset to first page on filter
    this.loadUsers();
  }

  toggleBlock(userId: string, isBlocked: boolean) {
    if (isBlocked) {
      this.store.dispatch(adminUserActions.unblockUser({ userId }));
    } else {
      this.store.dispatch(adminUserActions.blockUser({ userId, reason: 'Admin Manual Block' }));
    }
  }
}
