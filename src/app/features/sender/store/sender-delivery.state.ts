import { Delivery } from '../../../core/models/models';
import { ApiError } from '../../../shared/models/api.error.model';
export interface SenderDeliveryState {
  delivery: Delivery | null;
  deliveries: Delivery[] | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: ApiError | null;
}
