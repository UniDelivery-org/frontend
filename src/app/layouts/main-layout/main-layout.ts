import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Box, Package, Car, Activity, User, Bell, Plus } from 'lucide-angular';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {
  // Icons
  readonly Box = Box;
  readonly Package = Package;
  readonly Car = Car;
  readonly Activity = Activity;
  readonly User = User;
  readonly Bell = Bell;
  readonly Plus = Plus;
}