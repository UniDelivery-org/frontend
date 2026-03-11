import { Page } from '../../../shared/models/api.page.model';
import { ApiError } from '../../../shared/models/api.error.model';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { AdminStatsDTO } from '../data-access/admin-stats.dto';

export interface AdminDeliveryState {
  allDeliveries: Page<DeliveryResponseDTO> | null;
  selectedDelivery: DeliveryResponseDTO | null;
  stats: AdminStatsDTO | null;

  isLoading: boolean;
  error: ApiError | null;
}

export const initialState: AdminDeliveryState = {
  allDeliveries: null,
  selectedDelivery: null,
  stats: null,
  isLoading: false,
  error: null,
};
