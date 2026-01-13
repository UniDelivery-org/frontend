
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

export enum Payer {
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
    PICKUP = 'PICKUP',
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
    id: string; // UUID
    pickupGps: { lat: number, lng: number };
    dropoffGps: { lat: number, lng: number };
    price: number;
    weight: number;
    size: string;
    itemDescription: string;
    receiverPhone: string;
    status: DeliveryStatus;
    paymentType: PaymentType;
    payer: Payer;
    requiredVehicle: VehicleType;
    createdAt: Date;
    courierId?: string;
    senderId: string;
    trackingHistory?: TrackingLog[];
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
