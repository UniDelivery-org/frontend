import { DeliveryStatus } from '../../../core/models/models';

export interface CourierStatsDTO {
  totalCompletedDeliveries: number;
  failedOrCanceledDeliveries: number;
  totalEarnings: number;
  todayEarnings: number;
  currentMonthEarnings: number;
  averageRating: number;
  totalDistanceDrivenKm: number;
}

export interface UpdateStatusRequestDTO {
  status: DeliveryStatus;
}
