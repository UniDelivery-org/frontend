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
  Image,
  Box,
  CircleAlert
} from 'lucide-angular';
import { VehicleType, VerificationStatus } from '../../../../core/models/models';
import { vehicleActions } from '../../store/vehicle.actions';
import {
  selectMyVehicles,
  selectIsLoading,
  selectActiveVehicle,
} from '../../store/vehicle.reducer';
import { selectProfile } from '../../../profile/store/profile.reducer';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './vehicles.html'
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
  readonly CircleAlert = CircleAlert;
  readonly Image = Image;
  readonly Box = Box;

  // Enums/Types
  readonly VerificationStatus = VerificationStatus;
  readonly vehicleTypes = [VehicleType.MOTO, VehicleType.CAR, VehicleType.VAN, VehicleType.TRUCK];

  // Signals/State
  isModalOpen = signal(false);
  vehicles = this.store.selectSignal(selectMyVehicles);
  isLoading = this.store.selectSignal(selectIsLoading);
  activeVehicle = this.store.selectSignal(selectActiveVehicle);
  profile = this.store.selectSignal(selectProfile);
  imagePreview = signal<string | null>(null);
  imageFile = signal<File | null>(null);
  
  private toast = inject(ToastService);

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Basic Validation
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.toast.showError('Invalid File', 'Only JPG or PNG images are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toast.showError('File Too Large', 'Maximum file size is 5MB.');
        return;
      }

      this.imageFile.set(file);
      
      // Compute File reading for immediate Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  openModal() {
    this.addVehicleForm.reset({ type: VehicleType.CAR, color: '#FFFFFF' });
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.imageFile.set(null);
    this.imagePreview.set(null);
  }

  onSubmit() {
    if (this.addVehicleForm.valid && this.profile()?.id) {
      // Validate image exists
      const file = this.imageFile();
      if (!file) {
        this.toast.showError('Missing Photo', 'Please upload a photo of your vehicle.');
        return;
      }

      this.store.dispatch(vehicleActions.createVehicle({
        payload: {
          ...this.addVehicleForm.value,
          ownerId: this.profile()!.keycloakId,
          image: file
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
