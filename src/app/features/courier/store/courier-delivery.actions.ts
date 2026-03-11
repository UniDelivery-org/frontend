import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DeliveryStatus } from '../../../core/models/models';
import { ApiError } from '../../../shared/models/api.error.model';
import { Page } from '../../../shared/models/api.page.model';
import { DeliveryResponseDTO } from '../../sender/data-access/delivery.dto';
import { CourierStatsDTO } from '../data-access/courier-delivery.dto';

export const courierDeliveryActions = createActionGroup({
  source: 'Courier Delivery',
  events: {
    // Shared: Get Single Delivery
    'Load Delivery': props<{ id: string }>(),
    'Load Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Load Delivery Failure': props<{ error: ApiError }>(),

    // Shared: Get Pending Deliveries
    'Load Pending Deliveries': props<{ page?: number; size?: number }>(),
    'Load Pending Deliveries Success': props<{ deliveries: Page<DeliveryResponseDTO> }>(),
    'Load Pending Deliveries Failure': props<{ error: ApiError }>(),

    // Driver Deliveries Page
    'Load Driver Deliveries': props<{ driverId: string; page?: number; size?: number }>(),
    'Load Driver Deliveries Success': props<{ deliveries: Page<DeliveryResponseDTO> }>(),
    'Load Driver Deliveries Failure': props<{ error: ApiError }>(),

    // Driver Nearby Deliveries
    'Load Nearby Deliveries': props<{
      driverId: string;
      radius: number;
      page?: number;
      size?: number;
    }>(),
    'Load Nearby Deliveries Success': props<{ deliveries: Page<DeliveryResponseDTO> }>(),
    'Load Nearby Deliveries Failure': props<{ error: ApiError }>(),

    // Accept Delivery
    'Accept Delivery': props<{ deliveryId: string; driverId: string }>(),
    'Accept Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Accept Delivery Failure': props<{ error: ApiError }>(),

    // Update Status
    'Update Delivery Status': props<{ deliveryId: string; status: DeliveryStatus }>(),
    'Update Delivery Status Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Update Delivery Status Failure': props<{ error: ApiError }>(),

    // Check Active Delivery
    'Load Active Delivery': props<{ driverId: string }>(),
    'Load Active Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Load Active Delivery Failure': props<{ error: ApiError }>(),

    // Driver History
    'Load Delivery History': props<{
      driverId: string;
      status?: DeliveryStatus;
      page?: number;
      size?: number;
    }>(),
    'Load Delivery History Success': props<{ deliveries: Page<DeliveryResponseDTO> }>(),
    'Load Delivery History Failure': props<{ error: ApiError }>(),

    // Courier Stats
    'Load Courier Stats': props<{ driverId: string }>(),
    'Load Courier Stats Success': props<{ stats: CourierStatsDTO }>(),
    'Load Courier Stats Failure': props<{ error: ApiError }>(),
  },
});
