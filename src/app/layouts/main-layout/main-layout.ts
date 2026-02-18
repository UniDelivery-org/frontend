import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Box, Package, Car, Activity, User, Bell, Plus, Search, Menu, LogOut, Wallet, FileText, Settings } from 'lucide-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  
  // State
  currentRole = signal<'sender' | 'courier'>('sender');

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

  ngOnInit() {
    // Initial check
    this.updateRoleFromUrl(this.router.url);

    // Subscribe to navigation events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateRoleFromUrl(event.urlAfterRedirects || event.url);
    });
  }

  private updateRoleFromUrl(url: string) {
    if (url.includes('/courier')) {
      this.currentRole.set('courier');
    } else {
      this.currentRole.set('sender');
    }
  }
}