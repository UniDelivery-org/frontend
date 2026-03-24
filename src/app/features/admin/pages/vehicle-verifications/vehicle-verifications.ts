import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  LucideAngularModule,
  Search,
  SlidersHorizontal,
  Truck,
  Bike,
  Car,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Check,
  X,
  Eye,
  ArrowUpRight,
  AlertCircle
} from 'lucide-angular';
import { VehicleType, VerificationStatus } from '../../../../core/models/models';
import { vehicleActions } from '../../../courier/store/vehicle.actions';
import {
  selectSearchResults,
  selectIsLoading,
  selectTotalElements,
} from '../../../courier/store/vehicle.reducer';
import { adminUserActions } from '../../store/admin-users.actions';
import { selectUsersPage } from '../../store/admin-users.reducer';
import { VehicleSearchFilter } from '../../../courier/data-access/vehicle.dto';

@Component({
  selector: 'app-vehicle-verifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-uni-black text-uni-white tracking-tight">Vehicles Audit</h1>
          <p class="text-sm text-gray-400 mt-1">Review and verify vehicle registration details.</p>
        </div>
      </div>

      <!-- FILTERS -->
      <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="bg-gray-900 p-6 rounded-3xl border border-uni-white/5 space-y-5 shadow-2xl">
        <div class="flex items-center gap-2 mb-2">
          <lucide-icon [img]="SlidersHorizontal" [size]="18" class="text-uni-500"></lucide-icon>
          <h2 class="text-uni-white font-bold tracking-tight">Audit Filters</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest pl-1">Courier (Owner)</label>
            <div class="relative group">
              <select formControlName="ownerId"
                class="w-full bg-gray-950 border border-uni-white/10 rounded-xl py-2.5 px-4 text-sm text-uni-white focus:outline-none focus:border-uni-500 transition-all appearance-none cursor-pointer">
                <option value="">All Couriers</option>
                <option *ngFor="let user of users()?.content" [value]="user.keycloakId">{{ user.email }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest pl-1">Verification Status</label>
            <select formControlName="status"
              class="w-full bg-gray-950 border border-uni-white/10 rounded-xl py-2.5 px-4 text-sm text-uni-white focus:outline-none focus:border-uni-500 transition-all appearance-none cursor-pointer">
              <option value="">All Statuses</option>
              <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest pl-1">Vehicle Type</label>
            <select formControlName="type"
              class="w-full bg-gray-950 border border-uni-white/10 rounded-xl py-2.5 px-4 text-sm text-uni-white focus:outline-none focus:border-uni-500 transition-all appearance-none cursor-pointer">
              <option value="">All Types</option>
              <option *ngFor="let type of typeOptions" [value]="type">{{ type }}</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-uni-black text-gray-500 uppercase tracking-widest pl-1">Plate Number</label>
            <div class="relative flex items-center">
              <input type="text" formControlName="plateNumber" placeholder="e.g. 1234-A"
                class="w-full bg-gray-950 border border-uni-white/10 rounded-xl py-2.5 px-4 text-sm text-uni-white focus:outline-none focus:border-uni-500 transition-all uppercase font-mono tracking-wider">
              <lucide-icon [img]="Search" [size]="16" class="absolute right-4 text-gray-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" (click)="resetFilters()"
            class="px-6 py-2.5 bg-gray-800 text-gray-400 font-uni-black text-xs rounded-xl hover:bg-gray-700 transition-all uppercase tracking-widest">
            Reset
          </button>
          <button type="submit"
            class="px-8 py-2.5 bg-uni-500 text-uni-950 font-uni-black text-xs rounded-xl hover:bg-uni-400 transition-all shadow-lg shadow-uni-500/10 uppercase tracking-widest">
            Search Vehicles
          </button>
        </div>
      </form>

      <!-- RESULTS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Loading -->
        @if (isLoading()) {
          @for (n of [1,2,3,4,5,6]; track n) {
            <div class="bg-gray-900/50 border border-uni-white/5 rounded-3xl p-6 h-[260px] animate-pulse"></div>
          }
        }

        <!-- Empty -->
        @if (!isLoading() && vehicles().length === 0) {
          <div class="col-span-full py-20 bg-gray-900/30 border-2 border-dashed border-uni-white/5 rounded-[40px] flex flex-col items-center text-center justify-center">
             <lucide-icon [img]="Truck" [size]="48" class="text-gray-700 mb-4"></lucide-icon>
             <h3 class="text-xl font-uni-black text-uni-white">No vehicles to audit</h3>
             <p class="text-gray-500 mt-1">Adjust filters or check back later for new registration requests.</p>
          </div>
        }

        <!-- Vehicle Audit Cards -->
        @for (vehicle of vehicles(); track vehicle.id) {
          <div class="group bg-gray-900 rounded-[32px] border border-uni-white/5 overflow-hidden hover:border-uni-500/30 transition-all duration-500 shadow-2xl relative flex flex-col">
            
            <!-- Picture Header -->
            <div class="relative h-56 bg-gray-800 overflow-hidden shrink-0 group/img cursor-pointer" (click)="vehicle.image ? openImage(vehicle.image) : null">
              @if(vehicle.image) {
                <img [src]="vehicle.image" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" alt="Car">
                <!-- Magnify Hint Overlay -->
                <div class="absolute inset-0 bg-uni-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <span class="px-5 py-2.5 bg-gray-900 border border-uni-white/10 rounded-full text-white font-uni-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl drop-shadow-2xl hover:scale-105 transition-transform">
                    <lucide-icon [img]="Search" [size]="14" class="text-uni-500"></lucide-icon> Inspect Document
                  </span>
                </div>
              } @else {
                <div class="absolute inset-0 flex items-center justify-center text-gray-700 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[16px_16px]">
                  <lucide-icon [img]="getVehicleIcon(vehicle.type)" [size]="64" class="group-hover/img:scale-110 transition-transform duration-700 text-gray-600 drop-shadow-2xl"></lucide-icon>
                </div>
              }
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-900/50 to-transparent z-0 opacity-80 pointer-events-none"></div>
              
              <!-- Status Badge (Floating) -->
              <div class="absolute top-4 right-4 z-10 pointer-events-none">
                 <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-uni-black uppercase tracking-widest border backdrop-blur-md shadow-lg"
                  [ngClass]="{
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 backdrop-blur-md shadow-[0_4px_20px_rgba(234,179,8,0.2)]': vehicle.verificationStatus === VerificationStatus.PENDING,
                    'bg-uni-500/10 text-uni-500 border-uni-500/20 backdrop-blur-md shadow-[0_4px_20px_rgba(101,214,84,0.2)]': vehicle.verificationStatus === VerificationStatus.APPROVED,
                    'bg-red-500/10 text-red-500 border-red-500/20 backdrop-blur-md shadow-[0_4px_20px_rgba(239,68,68,0.2)]': vehicle.verificationStatus === VerificationStatus.REJECTED
                  }">
                  <lucide-icon [img]="getStatusIcon(vehicle.verificationStatus)" [size]="12"></lucide-icon>
                  {{ vehicle.verificationStatus }}
                 </span>
              </div>
            </div>

            <!-- Details -->
            <div class="p-6 flex flex-col flex-1 relative z-10 bg-gray-900 border-t border-uni-white/5">
              
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-uni-black text-white leading-tight mb-1 group-hover:text-uni-500 transition-colors">{{ vehicle.model }}</h3>
                  <p class="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Plate | <span class="text-uni-white font-bold">{{ vehicle.plateNumber }}</span></p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-uni-500 border border-uni-white/5 shadow-inner">
                  <lucide-icon [img]="getVehicleIcon(vehicle.type)" [size]="20"></lucide-icon>
                </div>
              </div>

              <!-- Meta Grid -->
              <div class="grid pr-4 space-y-2.5 mb-6 border-l-2 border-uni-white/10 pl-4 py-1">
                <div class="flex justify-between items-center text-[10px] font-uni-black uppercase tracking-wider text-gray-500">
                  <span>Courier Submitter</span>
                  <span class="text-white truncate max-w-[150px] font-mono tracking-tight">{{ vehicle.ownerEmail || 'Unknown Identity' }}</span>
                </div>
                <div class="flex justify-between items-center text-[10px] font-uni-black uppercase tracking-wider text-gray-500">
                  <span>Date Registered</span>
                  <span class="text-gray-400">{{ vehicle.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>

             <!-- Admin Actions -->
              <div class="flex gap-2.5 mt-auto">
                <button 
                  (click)="openRejectModal(vehicle.id)"
                  class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-uni-white/10 bg-gray-800 text-gray-400 font-uni-black hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 active:scale-95 transition-all text-[10px] uppercase tracking-widest group/btn hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <lucide-icon [img]="X" [size]="14" class="group-hover/btn:scale-125 transition-transform"></lucide-icon>
                  Reject
                </button>
                <button 
                  (click)="approve(vehicle.id)"
                  class="flex-2 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-uni-500 text-uni-950 font-uni-black hover:bg-uni-400 active:scale-95 transition-all text-[10px] uppercase tracking-widest group/btn shadow-[0_10px_30px_rgba(101,214,84,0.2)]">
                  <lucide-icon [img]="Check" [size]="14" class="group-hover/btn:scale-125 transition-transform"></lucide-icon>
                  Verify Access
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- PAGINATION -->
      <div *ngIf="totalElements() > 0" class="flex justify-between items-center py-6 border-t border-uni-white/5 text-[10px] font-uni-black text-gray-500 uppercase tracking-widest">
        <span>Displaying {{ vehicles().length }} of {{ totalElements() }} Entries</span>
        <div class="flex gap-2">
          <button [disabled]="currentPage === 0" (click)="onPageChange(currentPage - 1)" class="px-4 py-2 bg-gray-900 border border-uni-white/5 rounded-xl hover:bg-uni-white/5 disabled:opacity-30 transition-all underline-offset-4 hover:underline">Prev</button>
          <button [disabled]="(currentPage + 1) * pageSize >= totalElements()" (click)="onPageChange(currentPage + 1)" class="px-4 py-2 bg-gray-900 border border-uni-white/5 rounded-xl hover:bg-uni-white/5 disabled:opacity-30 transition-all underline-offset-4 hover:underline">Next</button>
        </div>
      </div>

    </div>

    <!-- REJECTION MODAL -->
    <div *ngIf="isRejectModalOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-uni-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div class="bg-gray-900 border border-uni-white/10 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <lucide-icon [img]="AlertCircle" [size]="20"></lucide-icon>
            </div>
            <h3 class="text-xl font-uni-black text-uni-white">Reject Vehicle</h3>
          </div>
          <p class="text-xs text-gray-400 mb-6 font-medium leading-relaxed">Clearly state why this vehicle registration is being rejected. This information will be visible to the courier.</p>

          <textarea
            [formControl]="rejectionReasonCtrl"
            rows="4"
            placeholder="e.g., Mismatched plate number, blurry photos, invalid vehicle type..."
            class="w-full bg-gray-950 border border-uni-white/10 rounded-2xl p-4 text-sm text-uni-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all resize-none shadow-inner"
          ></textarea>
          
          <div *ngIf="rejectionReasonCtrl.invalid && rejectionReasonCtrl.touched" class="text-red-500 text-[10px] mt-2 font-uni-black uppercase pl-1">
            Rejection reason is mandatory (min 5 chars)
          </div>
        </div>

        <div class="px-8 py-5 bg-gray-800/20 border-t border-uni-white/5 flex gap-3">
          <button (click)="closeRejectModal()" 
            class="flex-1 px-6 py-3 rounded-xl text-xs font-uni-black text-gray-400 hover:bg-gray-800 transition-all uppercase tracking-widest">
            Cancel
          </button>
          <button (click)="confirmReject()" 
            class="flex-2 px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-uni-black hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest">
            Reject Fleet Access
          </button>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX INSPECTION MODAL -->
    @if (selectedImageUrl()) {
      <div 
        class="fixed inset-0 z-9999 flex items-center justify-center bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-300 p-4 sm:p-8" 
        (click)="closeImage()">
        
        <button 
          class="absolute top-6 right-6 lg:top-10 lg:right-10 z-50 p-4 text-gray-400 hover:text-white bg-gray-900 border border-uni-white/10 hover:border-uni-white/30 rounded-full transition-all hover:scale-110 shadow-2xl" 
          (click)="closeImage()">
           <lucide-icon [img]="X" [size]="28"></lucide-icon>
        </button>
        
        <div class="relative max-w-[90vw] max-h-[90vh]">
           <img 
             [src]="selectedImageUrl()" 
             class="w-full h-full object-contain rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-uni-white/10 animate-in zoom-in-95 duration-500" 
             alt="Full Resolution Courier Document Verification" 
             (click)="$event.stopPropagation()">
             
           <div class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max px-6 py-3 bg-gray-900 border border-uni-white/10 rounded-2xl text-[10px] font-uni-black text-white uppercase tracking-widest shadow-xl flex items-center gap-2 opacity-50">
             <lucide-icon [img]="Eye" [size]="14" class="text-uni-500"></lucide-icon> Authenticity Verification Scan Phase
           </div>
        </div>
      </div>
    }
  `
})
export class VehicleVerificationsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  // Icons
  readonly Search = Search;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Truck = Truck;
  readonly Bike = Bike;
  readonly Car = Car;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly ChevronRight = ChevronRight;
  readonly Check = Check;
  readonly X = X;
  readonly Eye = Eye;
  readonly ArrowUpRight = ArrowUpRight;
  readonly AlertCircle = AlertCircle;

  // Enums/Options
  readonly VerificationStatus = VerificationStatus;
  statusOptions = Object.values(VerificationStatus);
  typeOptions = Object.values(VehicleType);

  // Selectors
  vehicles = this.store.selectSignal(selectSearchResults);
  isLoading = this.store.selectSignal(selectIsLoading);
  totalElements = this.store.selectSignal(selectTotalElements);
  users = this.store.selectSignal(selectUsersPage);

  // Forms & Pagination
  filterForm!: FormGroup;
  currentPage = 0;
  pageSize = 9;

  // Rejection Modal
  isRejectModalOpen = false;
  vehicleToRejectId: string | null = null;
  rejectionReasonCtrl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  // Lightbox Inspection State
  selectedImageUrl = signal<string | null>(null);

  openImage(url: string) {
    this.selectedImageUrl.set(url);
  }

  closeImage() {
    this.selectedImageUrl.set(null);
  }

  ngOnInit() {
    this.initFilterForm();
    this.loadVehicles();
    this.store.dispatch(adminUserActions.loadAllUsers({}));
  }

  private initFilterForm() {
    this.filterForm = this.fb.group({
      ownerId: [''],
      status: [''],
      type: [''],
      plateNumber: ['']
    });
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadVehicles();
  }

  resetFilters() {
    this.filterForm.reset({
      ownerId: '',
      status: '',
      type: '',
      plateNumber: ''
    });
    this.applyFilters();
  }

  loadVehicles() {
    const rawFilter = this.filterForm.value;
    const filter: VehicleSearchFilter = {
      ...rawFilter,
      plateNumberLike: rawFilter.plateNumber,
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'DESC'
    };

    // Clean up empty filters
    Object.keys(filter).forEach(key => {
      if ((filter as any)[key] === '') {
        delete (filter as any)[key];
      }
    });

    this.store.dispatch(vehicleActions.searchVehicles({ filter }));
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadVehicles();
  }

  approve(id: string) {
    this.store.dispatch(vehicleActions.verifyVehicle({
      vehicleId: id,
      request: { status: VerificationStatus.APPROVED }
    }));
  }

  openRejectModal(id: string) {
    this.vehicleToRejectId = id;
    this.rejectionReasonCtrl.reset();
    this.isRejectModalOpen = true;
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.vehicleToRejectId = null;
  }

  confirmReject() {
    if (this.rejectionReasonCtrl.invalid || !this.vehicleToRejectId) {
      this.rejectionReasonCtrl.markAsTouched();
      return;
    }

    this.store.dispatch(vehicleActions.verifyVehicle({
      vehicleId: this.vehicleToRejectId,
      request: {
        status: VerificationStatus.REJECTED,
        rejectionReason: this.rejectionReasonCtrl.value || undefined
      }
    }));

    this.closeRejectModal();
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
}
