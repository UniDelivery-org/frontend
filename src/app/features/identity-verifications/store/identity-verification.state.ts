import { ApiError } from '../../../shared/models/api.error.model';
import { IdentityDocumentResponseDTO } from '../data-access/identity-verification.dto';

export interface IdentityVerificationState {
  documents: IdentityDocumentResponseDTO[];
  myDocuments: IdentityDocumentResponseDTO[];
  selectedDocument: IdentityDocumentResponseDTO | null;
  isLoading: boolean;
  error: ApiError | null;
  totalElements: number;
}
