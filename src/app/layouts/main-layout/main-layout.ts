import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Box, Package, Car, Activity, User, Bell, Plus, Search, Menu, LogOut, Wallet, FileText, Settings, Truck, X, Check, Clock, Sun, Moon } from 'lucide-angular';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { Role } from '../../core/models/models';
import { RoleService } from '../../core/services/role.service';
import { authActions } from '../../features/auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roleService = inject(RoleService);
  private store = inject(Store);
  
  role = Role;
  // State
  currentRole = signal<Role>(Role.SENDER);

  // Icons
  readonly Box = Box;
  readonly Package = Package;
  readonly Car = Car;
  readonly Activity = Activity;
  readonly User = User;
  readonly Bell = Bell;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Menu = Menu;
  readonly LogOut = LogOut;
  readonly Wallet = Wallet;
  readonly FileText = FileText;
  readonly Settings = Settings;
  readonly Truck = Truck;
  readonly X = X;
  readonly Check = Check;
  readonly Clock = Clock;
  readonly Sun = Sun;
  readonly Moon = Moon;

  themeService = inject(ThemeService);

  // Notifications
  showNotifications = signal(false);
  notifications = signal([
    {
      id: 1,
      title: 'Driver Found!',
      message: 'Ahmed B. accepted your delivery request for #DEL-8821.',
      time: '2 mins ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Delivery Completed',
      message: 'Your package to Residence Al Yassamine has been delivered.',
      time: '1 hour ago',
      read: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Payment Successful',
      message: 'You have successfully topped up your wallet with 500 DH.',
      time: '3 hours ago',
      read: true,
      type: 'payment'
    }
  ]);
  logout() {
    this.store.dispatch(authActions.logoutProfile());
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
  }

  markAsRead(id: number) {
    this.notifications.update(list => 
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  ngOnInit() {
    // Set initial role from service
    this.currentRole.set(this.roleService.getRole());

    // Subscribe to route data for updates
    this.route.data.subscribe((data: any) => {
      if (data.role) {
        this.currentRole.set(data.role);
      }
    });

    // Subscribe to navigation events to refresh role from service
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRole.set(this.roleService.getRole());
    });
  }
}
