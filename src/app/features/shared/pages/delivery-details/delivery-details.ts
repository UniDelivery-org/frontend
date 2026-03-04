import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
       <div>
         <a href="javascript:history.back()" class="text-sm font-bold text-gray-400 hover:text-uni-white mb-4 inline-block">&larr; Back</a>
         <h1 class="text-2xl font-uni-black text-uni-white tracking-tight">Delivery Details</h1>
         <p class="text-gray-400 mt-1">Tracking ID: #DEL-{{ id() }}</p>
       </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
             <div class="bg-gray-900 border border-uni-white/5 rounded-2xl p-6 h-64 flex items-center justify-center">
                <p class="text-gray-500 font-bold">Map Placeholder</p>
             </div>
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-6">
             <div class="bg-gray-900 border border-uni-white/5 rounded-2xl p-6">
                <h3 class="font-bold text-uni-white mb-4">Status</h3>
                <div class="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                   In Progress
                </div>
             </div>
          </div>
       </div>
    </div>
  `
})
export class DeliveryDetailsComponent {
    id = input<string>();
}
