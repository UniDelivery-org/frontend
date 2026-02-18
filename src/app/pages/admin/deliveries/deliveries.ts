import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-deliveries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
       <div class="flex justify-between items-center">
         <div>
            <h1 class="text-2xl font-uni-black text-uni-white tracking-tight">All Deliveries</h1>
            <p class="text-gray-400 mt-1">Monitor and manage platform deliveries.</p>
         </div>
       </div>

       <div class="bg-gray-900 border border-uni-white/5 rounded-2xl overflow-hidden">
          <div class="p-8 text-center">
             <p class="text-gray-500 font-bold">Delivery list will appear here.</p>
          </div>
       </div>
    </div>
  `
})
export class AdminDeliveriesComponent {}
