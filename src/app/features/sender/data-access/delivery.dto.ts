import { DeliveryStatus, PayerType, PaymentMethod, VehicleType } from '../../../core/models/models';

export interface SenderStatsDTO {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  canceledDeliveries: number;
  totalSpent: number;
  currentMonthSpending: number;
}

export interface DeliveryRequestDTO {
  senderId: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLon: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLon: number;
  vehicleTypeRequired: VehicleType;
  weightKg: number;
  note?: string;
  receiverName?: string;
  receiverPhone?: string;
  agreedPrice: number;
  paymentMethod: PaymentMethod;
  payerType: PayerType;
}

export interface DeliveryResponseDTO {
  id: string;
  senderId: string;
  courierId?: string;

  pickupAddress: string;
  pickupLat: number;
  pickupLon: number;

  dropoffAddress: string;
  dropoffLat: number;
  dropoffLon: number;

  status: DeliveryStatus;
  vehicleTypeRequired: VehicleType;

  weightKg: number;
  distanceKm: number;
  note?: string;

  receiverName?: string;
  receiverPhone?: string;

  agreedPrice: number;
  paymentMethod: PaymentMethod;
  payerType: PayerType;

  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStatusRequestDTO {
  status: DeliveryStatus;
}
