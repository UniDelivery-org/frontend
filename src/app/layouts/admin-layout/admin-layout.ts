import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, ShieldCheck, LogOut, Menu, Box, Search, Bell, Settings, Truck, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-uni-950 text-white font-sans overflow-hidden selection:bg-uni-500 selection:text-uni-950">
      
      <!-- ===========================
           SIDEBAR (Desktop)
           =========================== -->
      <aside class="w-72 bg-gray-900 border-r border-white/5 flex flex-col z-20 hidden lg:flex relative">
        
        <!-- Logo Area -->
        <div class="p-8 pb-4">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10 flex items-center justify-center bg-uni-500/10 rounded-xl border border-uni-500/20">
              <lucide-icon [img]="Box" class="text-uni-500" [size]="20"></lucide-icon>
              <span class="absolute top-2 right-2 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-uni-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-uni-500"></span>
              </span>
            </div>
            <div>
              <span class="block font-black text-xl tracking-tight text-white leading-none">UniAdmin</span>
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Control Panel</span>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-2 mt-8">
          
          <!-- Dashboard -->
          <a routerLink="/admin/dashboard" routerLinkActive="bg-uni-500/10 text-uni-500 border-uni-500" 
             class="group flex items-center gap-4 px-4 py-3.5 rounded-xl border-l-[3px] border-transparent hover:bg-white/5 transition-all duration-300">
            <lucide-icon [img]="LayoutDashboard" [size]="20" class="group-hover:scale-110 transition-transform"></lucide-icon>
            <span class="font-bold text-sm tracking-wide">Dashboard</span>
          </a>
          
          <!-- Users -->
          <a routerLink="/admin/users" routerLinkActive="bg-uni-500/10 text-uni-500 border-uni-500" 
             class="group flex items-center gap-4 px-4 py-3.5 rounded-xl border-l-[3px] border-transparent hover:bg-white/5 transition-all duration-300">
            <lucide-icon [img]="Users" [size]="20" class="group-hover:scale-110 transition-transform"></lucide-icon>
            <span class="font-bold text-sm tracking-wide">Users Management</span>
          </a>

          <!-- Deliveries -->
          <a routerLink="/admin/deliveries" routerLinkActive="bg-uni-500/10 text-uni-500 border-uni-500"
             class="group flex items-center gap-4 px-4 py-3.5 rounded-xl border-l-[3px] border-transparent hover:bg-white/5 transition-all duration-300">
            <lucide-icon [img]="Truck" [size]="20" class="group-hover:scale-110 transition-transform"></lucide-icon>
            <span class="font-bold text-sm tracking-wide">Deliveries</span>
          </a>

          <!-- Verifications -->
          <a routerLink="/admin/verifications" routerLinkActive="bg-uni-500/10 text-uni-500 border-uni-500" 
             class="group flex items-center gap-4 px-4 py-3.5 rounded-xl border-l-[3px] border-transparent hover:bg-white/5 transition-all duration-300">
            <div class="relative">
               <lucide-icon [img]="ShieldCheck" [size]="20" class="group-hover:scale-110 transition-transform"></lucide-icon>
               <!-- Notification Dot -->
               <span class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </div>
            <span class="font-bold text-sm tracking-wide">Verifications</span>
          </a>

          <!-- Settings -->
          <a routerLink="/admin/settings" routerLinkActive="bg-uni-500/10 text-uni-500 border-uni-500" 
             class="group flex items-center gap-4 px-4 py-3.5 rounded-xl border-l-[3px] border-transparent hover:bg-white/5 transition-all duration-300">
            <lucide-icon [img]="Settings" [size]="20" class="group-hover:scale-110 transition-transform"></lucide-icon>
            <span class="font-bold text-sm tracking-wide">System Settings</span>
          </a>

        </nav>

        <!-- Admin Profile (Bottom) -->
        <div class="p-4 border-t border-white/5 bg-gray-900/50">
            <div class="flex items-center gap-3 mb-4 px-2">
                <div class="w-10 h-10 rounded-full bg-linear-to-tr from-uni-500 to-gray-700 p-[2px]">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=0a1f08&color=65d654" class="rounded-full w-full h-full border-2 border-gray-900">
                </div>
                <div>
                    <div class="text-sm font-bold text-white">Super Admin</div>
                    <div class="text-[10px] text-gray-500">admin&#64;unidelivery.ma</div>
                </div>
            </div>
            <button class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-wider border border-white/5 hover:border-red-500/20">
                <lucide-icon [img]="LogOut" [size]="16"></lucide-icon> Logout Session
            </button>
        </div>
      </aside>


      <!-- ===========================
           MAIN CONTENT AREA
           =========================== -->
      <div class="flex-1 flex flex-col relative overflow-hidden bg-uni-950">
        
        <!-- Background Grid Pattern -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0"></div>

        <!-- Top Header (Glass) -->
        <header class="h-20 border-b border-white/5 bg-gray-900/50 backdrop-blur-md flex justify-between items-center px-6 lg:px-10 relative z-20">
          
          <!-- Mobile Toggle -->
          <div class="lg:hidden flex items-center gap-3">
             <button class="p-2 text-gray-400 hover:text-white">
               <lucide-icon [img]="Menu" [size]="24"></lucide-icon>
             </button>
             <span class="font-black text-lg">UniAdmin</span>
          </div>

          <!-- Search Bar (Desktop) -->
          <div class="hidden lg:flex items-center relative w-96 group">
             <lucide-icon [img]="Search" [size]="18" class="absolute left-2 top-1.5 text-gray-500 group-focus-within:text-uni-500 transition-colors"></lucide-icon>
             <input type="text" placeholder="Search users, deliveries, IDs..." 
                    class="w-full bg-gray-950 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-uni-500 focus:ring-1 focus:ring-uni-500 transition-all">
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-4">
             <button class="relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
               <lucide-icon [img]="Bell" [size]="20"></lucide-icon>
               <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
             </button>
          </div>
        </header>

        <!-- Router Outlet Container -->
        <main class="flex-1 overflow-auto relative z-10 ">
          <div class="p-6 lg:p-10 max-w-7xl mx-auto">
              <router-outlet></router-outlet>
          </div>
        </main>

      </div>

    </div>
  `,
})
export class AdminLayoutComponent {
  // Icons
  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly ShieldCheck = ShieldCheck;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Box = Box;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Settings = Settings;
  readonly Truck = Truck;
  readonly Sun = Sun;
  readonly Moon = Moon;

  themeService = inject(ThemeService);
}