import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  LucideAngularModule,
  Plus,
  Bike,
  Car,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Settings,
  ShieldCheck,
  X,
  AlertCircle
} from 'lucide-angular';
import { VehicleType, VerificationStatus } from '../../../../core/models/models';
import { vehicleActions } from '../../store/vehicle.actions';
import {
  selectMyVehicles,
  selectIsLoading,
  selectActiveVehicle,
} from '../../store/vehicle.reducer';
import { selectProfile } from '../../../profile/store/profile.reducer';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="relative min-h-screen">
      <div class="space-y-8 max-w-6xl mx-auto p-4 animate-in fade-in duration-500" [class.blur-sm]="isModalOpen()">
        
        <!-- HEADER -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-uni-black text-uni-white tracking-tight">Fleet Management</h1>
            <p class="text-gray-400 mt-1 flex items-center gap-2">
              <lucide-icon [img]="ShieldCheck" [size]="14" class="text-uni-500"></lucide-icon>
              Verified vehicles allowed for delivery operations.
            </p>
          </div>
          <button 
            (click)="openModal()"
            class="flex items-center gap-2 px-6 py-3 bg-uni-500 text-uni-950 font-uni-black rounded-2xl hover:bg-uni-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-uni-500/10">
            <lucide-icon [img]="Plus" [size]="20"></lucide-icon>
            Add New Vehicle
          </button>
        </div>

        <!-- ACTIVE VEHICLE BANNER -->
        @if (activeVehicle()) {
          <div class="relative overflow-hidden bg-linear-to-r from-uni-500/20 to-transparent border border-uni-500/30 rounded-3xl p-6 mb-8 group">
            <div class="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <lucide-icon [img]="getVehicleIcon(activeVehicle()!.type)" [size]="200"></lucide-icon>
            </div>
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 rounded-2xl bg-uni-500 text-uni-950 flex items-center justify-center shadow-inner">
                  <lucide-icon [img]="getVehicleIcon(activeVehicle()!.type)" [size]="32"></lucide-icon>
                </div>
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-xl font-uni-black text-uni-white">Active: {{ activeVehicle()?.model }}</h2>
                    <span class="px-2.5 py-1 rounded-lg bg-uni-500/20 text-uni-500 text-[10px] font-uni-black uppercase tracking-widest border border-uni-500/20">Operational</span>
                  </div>
                  <p class="text-gray-400 font-mono text-sm mt-1 uppercase">{{ activeVehicle()?.plateNumber }}</p>
                </div>
              </div>
              <button class="p-3 text-gray-400 hover:text-uni-white hover:bg-uni-white/5 rounded-xl transition-colors">
                <lucide-icon [img]="Settings" [size]="20"></lucide-icon>
              </button>
            </div>
          </div>
        }

        <!-- VEHICLE GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Loading State -->
          @if (isLoading() && vehicles().length === 0) {
            @for (n of [1,2,3]; track n) {
              <div class="bg-gray-900/50 border border-uni-white/5 rounded-3xl p-6 h-[220px] animate-pulse">
                <div class="flex justify-between items-start mb-6">
                  <div class="w-12 h-12 bg-gray-800 rounded-2xl"></div>
                  <div class="w-20 h-6 bg-gray-800 rounded-lg"></div>
                </div>
                <div class="space-y-3">
                  <div class="w-2/3 h-5 bg-gray-800 rounded"></div>
                  <div class="w-1/2 h-4 bg-gray-800 rounded"></div>
                </div>
              </div>
            }
          }

          <!-- Empty State -->
          @if (!isLoading() && vehicles().length === 0) {
            <div class="col-span-full py-20 bg-gray-900/30 border-2 border-dashed border-uni-white/5 rounded-[40px] flex flex-col items-center text-center justify-center">
               <div class="w-20 h-20 rounded-[32px] bg-uni-white/5 flex items-center justify-center mb-6 text-gray-600">
                 <lucide-icon [img]="Bike" [size]="40"></lucide-icon>
               </div>
               <h3 class="text-xl font-uni-black text-uni-white mb-2">No vehicles found</h3>
               <p class="text-gray-500 max-w-sm mb-8 font-medium">Add your first vehicle to start accepting delivery requests and earn rewards.</p>
               <button 
                (click)="openModal()"
                class="px-8 py-3.5 bg-gray-900 border border-uni-white/10 text-uni-white font-uni-black rounded-2xl hover:bg-uni-white/5 transition-all shadow-xl">
                 Get Started
               </button>
            </div>
          }

          <!-- Vehicle Cards -->
          @for (vehicle of vehicles(); track vehicle.id) {
            <div 
              class="relative group bg-gray-900 border transition-all duration-500 rounded-[32px] overflow-hidden"
              [ngClass]="{
                'border-uni-500/40 bg-linear-to-b from-gray-900 to-uni-500/5 shadow-2xl shadow-uni-500/5': vehicle.isActive,
                'border-uni-white/5 hover:border-uni-white/20': !vehicle.isActive
              }">
              
              <div class="p-6">
                <div class="flex justify-between items-start mb-6">
                  <div 
                    class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500"
                    [ngClass]="{
                      'bg-uni-500 text-uni-950': vehicle.isActive,
                      'bg-gray-800 text-gray-400 group-hover:bg-uni-white/10 group-hover:text-uni-white': !vehicle.isActive
                    }">
                    <lucide-icon [img]="getVehicleIcon(vehicle.type)" [size]="24"></lucide-icon>
                  </div>

                  <div class="flex flex-col items-end gap-2">
                     <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-uni-black uppercase tracking-widest border"
                      [ngClass]="{
                        'bg-uni-500/10 text-uni-500 border-uni-500/20': vehicle.verificationStatus === VerificationStatus.APPROVED,
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': vehicle.verificationStatus === VerificationStatus.PENDING,
                        'bg-red-500/10 text-red-500 border-red-500/20': vehicle.verificationStatus === VerificationStatus.REJECTED
                      }">
                      <lucide-icon [img]="getStatusIcon(vehicle.verificationStatus)" [size]="10"></lucide-icon>
                      {{ vehicle.verificationStatus }}
                     </span>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-lg font-uni-black text-uni-white leading-tight">{{ vehicle.model }}</h3>
                  <p class="text-sm font-mono text-gray-500 mt-1 uppercase tracking-wider">{{ vehicle.plateNumber }}</p>
                </div>

                <div class="flex items-center justify-between mt-auto">
                  <div class="flex items-center gap-2">
                     <div class="w-3 h-3 rounded-full" [style.background-color]="vehicle.color || '#333'"></div>
                     <span class="text-xs text-gray-500 font-bold uppercase tracking-widest">{{ vehicle.type }}</span>
                  </div>
                  
                  @if (!vehicle.isActive && vehicle.verificationStatus === VerificationStatus.APPROVED) {
                    <button 
                      (click)="setActive(vehicle.id)"
                      class="px-4 py-2 bg-uni-white/5 hover:bg-uni-white/10 border border-uni-white/5 text-uni-white text-xs font-uni-black rounded-xl transition-all uppercase tracking-widest">
                      Activate
                    </button>
                  } @else if (vehicle.isActive) {
                    <div class="flex items-center gap-1.5 text-uni-500">
                      <lucide-icon [img]="Clock" [size]="14"></lucide-icon>
                      <span class="text-[10px] font-uni-black uppercase tracking-widest">In Use</span>
                    </div>
                  }
                </div>
              </div>
              
              <!-- Context Menu Button -->
              <button class="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <lucide-icon [img]="MoreVertical" [size]="18"></lucide-icon>
              </button>
            </div>
          }

        </div>
      </div>

      <!-- ADD VEHICLE MODAL -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-uni-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div class="bg-gray-900 border border-uni-white/10 rounded-[32px] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            
            <!-- Modal Header -->
            <div class="p-6 border-b border-uni-white/5 flex justify-between items-center bg-gray-800/20">
              <div>
                <h2 class="text-xl font-uni-black text-uni-white">Add New Vehicle</h2>
                <p class="text-xs text-gray-500 mt-1">Register your vehicle for deliveries</p>
              </div>
              <button (click)="closeModal()" class="p-2 text-gray-500 hover:text-uni-white hover:bg-uni-white/5 rounded-full transition-all">
                <lucide-icon [img]="X" [size]="20"></lucide-icon>
              </button>
            </div>

            <!-- Modal Body -->
            <form [formGroup]="addVehicleForm" (ngSubmit)="onSubmit()" class="p-8 space-y-6">
              
              <!-- Vehicle Type Selection -->
              <div class="space-y-3">
                <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest ml-1">Type of Vehicle</label>
                <div class="grid grid-cols-4 gap-3">
                  @for (type of vehicleTypes; track type) {
                    <button 
                      type="button"
                      (click)="addVehicleForm.patchValue({ type })"
                      [class]="addVehicleForm.get('type')?.value === type 
                               ? 'bg-uni-500 border-uni-500 text-uni-950' 
                               : 'bg-gray-800/50 border-uni-white/5 text-gray-400 hover:border-uni-white/20'"
                      class="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300">
                      <lucide-icon [img]="getVehicleIcon(type)" [size]="20"></lucide-icon>
                      <span class="text-[10px] font-uni-black uppercase tracking-tight">{{ type }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Inputs -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest ml-1">Vehicle Model</label>
                  <input 
                    type="text" 
                    formControlName="model"
                    placeholder="e.g. Dacia Logan"
                    class="w-full bg-gray-800/50 border border-uni-white/5 rounded-xl px-4 py-3 text-sm text-uni-white placeholder:text-gray-600 focus:outline-hidden focus:border-uni-500/50 transition-all">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest ml-1">Plate Number</label>
                  <input 
                    type="text" 
                    formControlName="plateNumber"
                    placeholder="e.g. 1234-A-56"
                    class="w-full bg-gray-800/50 border border-uni-white/5 rounded-xl px-4 py-3 text-sm text-uni-white font-mono placeholder:text-gray-600 focus:outline-hidden focus:border-uni-500/50 transition-all uppercase">
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest ml-1">Color (Optional)</label>
                <div class="flex flex-wrap gap-2">
                  @for (c of ['#000000','#FFFFFF','#FF0000','#0000FF', '#808080']; track c) {
                    <button 
                      type="button" 
                      (click)="addVehicleForm.patchValue({ color: c })"
                      [class.ring-2]="addVehicleForm.get('color')?.value === c"
                      [style.background-color]="c"
                      class="w-8 h-8 rounded-full border border-uni-white/10 ring-uni-500 ring-offset-2 ring-offset-gray-900 transition-all"></button>
                  }
                  <input 
                    type="text" 
                    formControlName="color"
                    placeholder="#hex"
                    class="flex-1 min-w-0 bg-gray-800/50 border border-uni-white/5 rounded-xl px-4 py-1.5 text-xs text-uni-white focus:outline-hidden focus:border-uni-500/50">
                </div>
              </div>

              <!-- Error Alert -->
              @if (addVehicleForm.invalid && addVehicleForm.touched) {
                <div class="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-wide bg-red-400/5 p-3 rounded-xl border border-red-400/10">
                  <lucide-icon [img]="AlertCircle" [size]="14"></lucide-icon>
                  Please fill all required fields correctly.
                </div>
              }

              <!-- Submit -->
              <div class="pt-4 flex gap-3">
                <button 
                  type="button"
                  (click)="closeModal()"
                  class="flex-1 px-6 py-4 bg-gray-800 text-gray-400 font-uni-black rounded-2xl hover:bg-gray-700 transition-all">
                  Cancel
                </button>
                <button 
                  type="submit"
                  [disabled]="addVehicleForm.invalid || isLoading()"
                  class="flex-[2] px-6 py-4 bg-uni-500 disabled:opacity-50 disabled:cursor-not-allowed text-uni-950 font-uni-black rounded-2xl hover:bg-uni-400 transition-all shadow-lg shadow-uni-500/10">
                  {{ isLoading() ? 'Registering...' : 'Register Vehicle' }}
                </button>
              </div>

            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  // Icons
  readonly Plus = Plus;
  readonly Bike = Bike;
  readonly Car = Car;
  readonly Truck = Truck;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly MoreVertical = MoreVertical;
  readonly Settings = Settings;
  readonly ShieldCheck = ShieldCheck;
  readonly X = X;
  readonly AlertCircle = AlertCircle;

  // Enums/Types
  readonly VerificationStatus = VerificationStatus;
  readonly vehicleTypes = [VehicleType.MOTO, VehicleType.CAR, VehicleType.VAN, VehicleType.TRUCK];

  // Signals/State
  isModalOpen = signal(false);
  vehicles = this.store.selectSignal(selectMyVehicles);
  isLoading = this.store.selectSignal(selectIsLoading);
  activeVehicle = this.store.selectSignal(selectActiveVehicle);
  profile = this.store.selectSignal(selectProfile);

  // Form
  addVehicleForm!: FormGroup;

  ngOnInit() {
    this.store.dispatch(vehicleActions.loadMyVehicles({}));
    this.store.dispatch(vehicleActions.loadActiveVehicle());
    this.initForm();
  }

  private initForm() {
    this.addVehicleForm = this.fb.group({
      type: [VehicleType.CAR, [Validators.required]],
      model: ['', [Validators.required, Validators.minLength(2)]],
      plateNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Z\-\s]+$/i)]],
      color: ['#FFFFFF']
    });
  }

  openModal() {
    this.addVehicleForm.reset({ type: VehicleType.CAR, color: '#FFFFFF' });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSubmit() {
    if (this.addVehicleForm.valid && this.profile()?.id) {
      this.store.dispatch(vehicleActions.createVehicle({
        payload: {
          ...this.addVehicleForm.value,
          ownerId: this.profile()!.keycloakId
        }
      }));
      this.closeModal();
    }
  }

  getVehicleIcon(type: VehicleType) {
    switch (type) {
      case VehicleType.MOTO: return this.Bike;
      case VehicleType.CAR: return this.Car;
      case VehicleType.VAN: return this.Truck;
      case VehicleType.TRUCK: return this.Truck;
      default: return this.Car;
    }
  }

  getStatusIcon(status: VerificationStatus) {
    switch (status) {
      case VerificationStatus.APPROVED: return this.CheckCircle;
      case VerificationStatus.PENDING: return this.Clock;
      case VerificationStatus.REJECTED: return this.XCircle;
      default: return this.Clock;
    }
  }

  setActive(id: string) {
    this.store.dispatch(vehicleActions.setActiveVehicle({ vehicleId: id }));
  }
}
