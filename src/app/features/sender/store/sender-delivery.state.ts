import { DeliveryResponseDTO } from '../data-access/delivery.dto';
import { ApiError } from '../../../shared/models/api.error.model';
import { Page } from '../../../shared/models/api.page.model';
import { SenderStatsDTO } from '../data-access/delivery.dto';
export interface SenderDeliveryState {
  delivery: DeliveryResponseDTO | null;
  deliveries: Page<DeliveryResponseDTO> | null;
  stats: SenderStatsDTO | null;
  isLoading: boolean;
  error: ApiError | null;
}
