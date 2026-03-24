import { VehicleType, VerificationStatus } from '../../../core/models/models';

export interface VehicleResponseDTO {
  id: string; // UUID
  ownerId: string; // UUID
  type: VehicleType;
  model: string;
  plateNumber: string;
  color?: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  ownerEmail?: string;
  imageUrl?: string;
  createdAt: string; // Instant
  updatedAt: string; // Instant
}

export interface VehicleCreateDTO {
  ownerId: string; // UUID
  type: VehicleType;
  model: string;
  plateNumber: string;
  color?: string;
  image: File | null;
}

export interface VehicleSearchFilter {
  ownerId?: string;
  type?: VehicleType;
  verificationStatus?: VerificationStatus;
  isActive?: boolean;
  modelLike?: string;
  plateNumberLike?: string;
  colorLike?: string;
  createdFrom?: string; // Instant
  createdTo?: string; // Instant
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}
