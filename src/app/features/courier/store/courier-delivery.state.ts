import { Page } from '../../../shared/models/api.page.model';
import { ApiError } from '../../../shared/models/api.error.model';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { CourierStatsDTO } from '../data-access/courier-delivery.dto';

export interface CourierDeliveryState {
  // Single delivery view / active delivery
  delivery: DeliveryResponseDTO | null;

  // Lists
  pendingDeliveries: Page<DeliveryResponseDTO> | null;
  driverDeliveries: Page<DeliveryResponseDTO> | null;
  nearbyDeliveries: Page<DeliveryResponseDTO> | null;
  history: Page<DeliveryResponseDTO> | null;

  // Stats
  stats: CourierStatsDTO | null;

  // General state
  isLoading: boolean;
  error: ApiError | null;
}

export const initialState: CourierDeliveryState = {
  delivery: null,
  pendingDeliveries: null,
  driverDeliveries: null,
  nearbyDeliveries: null,
  history: null,
  stats: null,
  isLoading: false,
  error: null,
};
