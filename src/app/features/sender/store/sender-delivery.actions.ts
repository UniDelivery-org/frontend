import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Delivery, DeliveryStatus } from '../../../core/models/models';
import { ApiError } from '../../../shared/models/api.error.model';
import { Page } from '../../../shared/models/api.page.model';
import {
  DeliveryRequestDTO,
  DeliveryResponseDTO,
  SenderStatsDTO,
} from '../data-access/delivery.dto';

export const senderDeliveryActions = createActionGroup({
  source: 'Sender Delivery',
  events: {
    // Shared: Get Single Delivery
    'Load Delivery': props<{ id: string }>(),
    'Load Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Load Delivery Failure': props<{ error: ApiError }>(),

    // Create Delivery
    'Create Delivery': props<{ deliveryRequest: DeliveryRequestDTO }>(),
    'Create Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Create Delivery Failure': props<{ error: ApiError }>(),

    // Update Delivery
    'Update Delivery': props<{ id: string; deliveryRequest: DeliveryRequestDTO }>(),
    'Update Delivery Success': props<{ delivery: DeliveryResponseDTO }>(),
    'Update Delivery Failure': props<{ error: ApiError }>(),

    // Delete Delivery
    'Delete Delivery': props<{ id: string }>(),
    'Delete Delivery Success': emptyProps(),
    'Delete Delivery Failure': props<{ error: ApiError }>(),

    // Customer Deliveries Page
    'Load Customer Deliveries': props<{ customerId: string; page?: number; size?: number }>(),
    'Load Customer Deliveries Success': props<{ pageData: Page<DeliveryResponseDTO> }>(),
    'Load Customer Deliveries Failure': props<{ error: ApiError }>(),

    // Active Deliveries Page
    'Load Active Deliveries': props<{ customerId: string; page?: number; size?: number }>(),
    'Load Active Deliveries Success': props<{ pageData: Page<DeliveryResponseDTO> }>(),
    'Load Active Deliveries Failure': props<{ error: ApiError }>(),

    // Customer History
    'Load Delivery History': props<{
      customerId: string;
      status?: DeliveryStatus;
      page?: number;
      size?: number;
    }>(),
    'Load Delivery History Success': props<{ pageData: Page<DeliveryResponseDTO> }>(),
    'Load Delivery History Failure': props<{ error: ApiError }>(),

    // Sender Stats
    'Load Sender Stats': props<{ customerId: string }>(),
    'Load Sender Stats Success': props<{ stats: SenderStatsDTO }>(),
    'Load Sender Stats Failure': props<{ error: ApiError }>(),
  },
});
