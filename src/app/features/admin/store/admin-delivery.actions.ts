import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DeliveryStatus } from '../../../core/models/models';
import { ApiError } from '../../../shared/models/api.error.model';
import { Page } from '../../../shared/models/api.page.model';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { AdminStatsDTO } from '../data-access/admin-stats.dto';

export const adminDeliveryActions = createActionGroup({
  source: 'Admin Delivery',
  events: {
    // Load All Deliveries
    'Load All Deliveries': props<{ status?: DeliveryStatus; page?: number; size?: number }>(),
    'Load All Deliveries Success': props<{ deliveries: Page<DeliveryResponseDTO> }>(),
    'Load All Deliveries Failure': props<{ error: ApiError }>(),

    // Cancel Delivery
    'Cancel Delivery': props<{ deliveryId: string; reason: string }>(),
    'Cancel Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Cancel Delivery Failure': props<{ error: ApiError }>(),

    // Admin Stats
    'Load Admin Stats': emptyProps(),
    'Load Admin Stats Success': props<{ stats: AdminStatsDTO }>(),
    'Load Admin Stats Failure': props<{ error: ApiError }>(),
  },
});
