import { Component, inject, OnInit } from '@angular/core';
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
          <div class="group bg-gray-900 rounded-[32px] border border-uni-white/5 overflow-hidden hover:border-uni-500/30 transition-all duration-500 shadow-2xl relative">
            
            <!-- Type Icon & Status Badge -->
            <div class="p-6 pb-0 flex justify-between items-start">
              <div class="w-14 h-14 rounded-2xl bg-uni-white/5 flex items-center justify-center text-uni-500 group-hover:scale-110 transition-transform duration-500">
                <lucide-icon [img]="getVehicleIcon(vehicle.type)" [size]="28"></lucide-icon>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-uni-black uppercase tracking-widest border"
                [ngClass]="{
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': vehicle.verificationStatus === VerificationStatus.PENDING,
                  'bg-uni-500/10 text-uni-500 border-uni-500/20': vehicle.verificationStatus === VerificationStatus.APPROVED,
                  'bg-red-500/10 text-red-500 border-red-500/20': vehicle.verificationStatus === VerificationStatus.REJECTED
                }">
                <lucide-icon [img]="getStatusIcon(vehicle.verificationStatus)" [size]="10"></lucide-icon>
                {{ vehicle.verificationStatus }}
              </span>
            </div>

            <!-- Details -->
            <div class="p-6">
              <div class="mb-4">
                <h3 class="text-lg font-uni-black text-uni-white leading-tight group-hover:text-uni-500 transition-colors">{{ vehicle.model }}</h3>
                <p class="text-xs font-mono text-gray-500 mt-1 uppercase tracking-widest border-b border-uni-white/5 pb-3">Plate: {{ vehicle.plateNumber }}</p>
              </div>

              <div class="space-y-2 mb-6">
                <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <span>Owner Email:</span>
                  <span class="text-uni-white">{{ vehicle.ownerEmail || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <span>Registered:</span>
                  <span class="text-gray-400">{{ vehicle.createdAt | date:'shortDate' }}</span>
                </div>
              </div>

              <!-- Admin Actions -->
              <div class="flex gap-3 mt-auto">
                <button 
                  (click)="openRejectModal(vehicle.id)"
                  class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 active:scale-95 transition-all text-[11px] uppercase tracking-widest group/btn">
                  <lucide-icon [img]="X" [size]="16"></lucide-icon>
                  Reject
                </button>
                <button 
                  (click)="approve(vehicle.id)"
                  class="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-uni-500 text-uni-950 font-bold hover:bg-uni-400 active:scale-95 transition-all text-[11px] uppercase tracking-widest group/btn shadow-lg shadow-uni-500/10">
                  <lucide-icon [img]="Check" [size]="16"></lucide-icon>
                  Approve
                </button>
              </div>
            </div>

            <!-- Vehicle Preview Decoration -->
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <lucide-icon [img]="getVehicleIcon(vehicle.type)" [size]="120"></lucide-icon>
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
