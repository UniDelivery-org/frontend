import { ApiError } from '../../../shared/models/api.error.model';
import { VehicleResponseDTO } from '../data-access/vehicle.dto';

export interface VehicleState {
  myVehicles: VehicleResponseDTO[];
  activeVehicle: VehicleResponseDTO | null;
  searchResults: VehicleResponseDTO[];
  totalElements: number;
  isLoading: boolean;
  error: ApiError | null;
}

export const initialVehicleState: VehicleState = {
  myVehicles: [],
  activeVehicle: null,
  searchResults: [],
  totalElements: 0,
  isLoading: false,
  error: null,
};
