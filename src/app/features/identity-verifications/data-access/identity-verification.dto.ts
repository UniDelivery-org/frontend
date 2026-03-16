import { IdentityType, VerificationStatus } from '../../../core/models/models';

export interface VerificationDTO {
  status: VerificationStatus;
  rejectionReason?: string | null; // Optional, as it might only be populated if REJECTED
}

export interface IdentityDocumentResponseDTO {
  id: string;              // UUID translates to string
  ownerId: string;         // UUID translates to string
  type: IdentityType;
  fileUrl: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  createdAt: string;       // Instant serializes to ISO-8601 string
  updatedAt: string;       // Instant serializes to ISO-8601 string
}

export interface IdUploadDTO {
  identityDocType: IdentityType; 
  file: File | Blob;       
}

export interface IdentityDocsFilter {
  ownerId?: string;
  type?: IdentityType;
  status?: VerificationStatus;
  createdAfter?: string;
  createdBefore?: string;
  rejectionReason?: string;
  page?: number;
  size?: number;
  sort?: string;
}
