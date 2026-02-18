import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
           <h1 class="text-2xl font-black text-white tracking-tight">My Vehicles</h1>
           <p class="text-gray-400 mt-1">Manage your delivery vehicles and documents.</p>
        </div>
        <button class="px-4 py-2 bg-uni-500 text-uni-950 font-bold rounded-xl hover:bg-uni-400 transition-colors">
          Add Vehicle
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Placeholder Card -->
        <div class="bg-gray-900 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center justify-center min-h-[200px] border-dashed border-gray-700">
           <p class="text-gray-500 font-bold">No vehicles added yet.</p>
        </div>
      </div>
    </div>
  `
})
export class VehiclesComponent {}
