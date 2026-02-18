import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Truck, MapPin, Clock } from 'lucide-angular';
import gsap from 'gsap';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen flex bg-uni-950 text-uni-white font-sans overflow-hidden selection:bg-uni-500 selection:text-uni-950">
      
      <!-- LEFT SIDE: Brand & Visuals (Desktop Only) -->
      <div class="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        
        <!-- Background: Abstract Map or City Night -->
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
          <!-- Green Gradient Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-uni-950 via-uni-950/60 to-uni-900/40"></div>
        </div>

        <!-- Content Container -->
        <div #brandingContent class="relative z-10 max-w-lg px-12 opacity-0 translate-y-8">
          
          <!-- Floating UI Element (Mock Notification) -->
          <div class="mb-12 transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out cursor-default">
             <div class="glass-panel p-5 rounded-2xl border border-uni-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <!-- Shine Effect -->
                <div class="absolute inset-0 bg-linear-to-r from-transparent via-uni-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-[shine_1.5s_infinite]"></div>
                
                <div class="flex items-center gap-4 relative z-10">
                  <div class="w-12 h-12 rounded-full bg-uni-500/20 flex items-center justify-center border border-uni-500/30 text-uni-500">
                    <lucide-icon [img]="Truck" [size]="24"></lucide-icon>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-200">Courier Arriving</div>
                    <div class="flex items-center gap-1 text-xs text-uni-500 font-medium mt-0.5">
                      <lucide-icon [img]="Clock" [size]="12"></lucide-icon> 2 mins away
                    </div>
                  </div>
                  <div class="ml-auto text-right">
                    <div class="text-xs text-gray-400">Est. Price</div>
                    <div class="font-bold text-white">45 DH</div>
                  </div>
                </div>

                <!-- Fake Progress Bar -->
                <div class="mt-4 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-uni-500 w-3/4 rounded-full shadow-[0_0_10px_#65d654]"></div>
                </div>
             </div>
          </div>

          <!-- Text -->
          <h1 class="text-5xl lg:text-6xl font-uni-black mb-6 tracking-tighter leading-[1.1]">
            Move it <br>
            <span class="text-transparent bg-clip-text bg-linear-to-r from-uni-500 to-white">Your Way.</span>
          </h1>
          <p class="text-lg text-gray-400 font-medium leading-relaxed max-w-sm">
            Join the logistics revolution. From scooters to trucks, set your price and choose your driver instantly.
          </p>

        </div>
      </div>

      <!-- RIGHT SIDE: Form Container -->
      <div class="w-full lg:w-1/2 flex flex-col relative z-20 bg-uni-950">
        
        <!-- Mobile Background Pattern (Subtle Grid) -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

        <!-- Mobile Header (Logo) -->
        <div class="lg:hidden absolute top-0 left-0 w-full p-6 flex items-center gap-2 z-30">
          <div class="w-8 h-8 rounded-lg bg-uni-500 flex items-center justify-center text-uni-950">
             <!-- Simple Logo Shape -->
             <div class="w-4 h-4 border-2 border-uni-950 rounded-sm"></div>
          </div>
          <span class="text-xl font-bold tracking-tight text-white">UniDelivery</span>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div #formContent class="w-full max-w-md opacity-0 translate-y-4 relative z-10">
            <router-outlet></router-outlet>
          </div>
        </div>

        <!-- Footer / Legal -->
        <div class="p-6 text-center lg:text-left lg:pl-12 text-xs text-gray-600 relative z-10">
          &copy; 2026 UniDelivery Maroc. <a href="#" class="hover:text-gray-400 transition-colors">Privacy</a> &bull; <a href="#" class="hover:text-gray-400 transition-colors">Terms</a>
        </div>
      </div>

    </div>
  `,
})
export class AuthLayout implements AfterViewInit {
  // Register Icons
  readonly Truck = Truck;
  readonly MapPin = MapPin;
  readonly Clock = Clock;

  @ViewChild('brandingContent') brandingContent!: ElementRef;
  @ViewChild('formContent') formContent!: ElementRef;

  ngAfterViewInit() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(this.brandingContent.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.2
    })
    .to(this.formContent.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, '-=0.6');
  }
}
