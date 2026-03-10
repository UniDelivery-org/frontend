
// =======================
// ENUMS
// =======================

export enum Role {
    ADMIN = 'ADMIN',
    SENDER = 'SENDER',
    COURIER = 'COURIER'
}

export enum VerificationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum DeliveryStatus {
    CREATED = 'CREATED',
    MATCHED = 'MATCHED',
    ACCEPTED = 'ACCEPTED',
    PICKED = 'PICKED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentType {
    PREPAID = 'PREPAID',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}
export enum PaymentMethod {
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
    WALLET = 'WALLET',
    ONLINE_CARD = 'ONLINE_CARD'
}

export enum PayerType {
    SENDER = 'SENDER',
    RECEIVER = 'RECEIVER'
}

export enum TransactionType {
    EARNING = 'EARNING',
    WITHDRAWAL = 'WITHDRAWAL',
    COMMISSION_DEBT = 'COMMISSION_DEBT'
}

export enum VehicleType {
    MOTO = 'MOTO',
    CAR = 'CAR',
    VAN = 'VAN',
    TRUCK = 'TRUCK'
}

export enum IdentityType {
    CIN = 'CIN',
    PASSPORT = 'PASSPORT',
    DRIVERS_LICENSE = 'DRIVERS_LICENSE'
}

export enum VehicleDocumentType {
    CARTE_GRISE = 'CARTE_GRISE',
    ASSURANCE = 'ASSURANCE'
}

// =======================
// ENTITIES
// =======================

export interface User {
    id: string; // UUID
    name: string;
    email: string;
    phone: string;
    rating: number;
    city: string;
    isBlocked: boolean;
    role: Role;
    wallet?: Wallet; // 1-to-1 relationship
}

export interface Wallet {
    id: string; // UUID
    totalEarnings: number;
    cashOnHand: number;
    debtToApp: number;
    transactions?: WalletTransaction[];
}

export interface IdentityDocument {
    id: string; // UUID
    url: string;
    type: IdentityType;
    status: VerificationStatus;
    submittedAt: Date;
    verifiedAt?: Date;
}

export interface Vehicle {
    id: string; // UUID
    plateNumber: string;
    type: VehicleType;
    capacity: number;
    isActive: boolean;
    status: VerificationStatus;
    documents?: VehicleDocument[];
}

export interface VehicleDocument {
    id: string; // UUID
    url: string;
    type: VehicleDocumentType;
    status: VerificationStatus;
    expiryDate: Date;
}

export interface Delivery {
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

  receiverName: string;
  receiverPhone: string;

  agreedPrice: number;
  paymentMethod: PaymentMethod;
  payerType: PayerType;

  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingLog {
    id: string; // UUID
    latitude: number;
    longitude: number;
    timestamp: Date;
}

export interface WalletTransaction {
    id: string; // UUID
    amount: number;
    type: TransactionType;
    description: string;
    createdAt: Date;
}
