import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApiError } from '../../../shared/models/api.error.model';
import { 
  IdentityDocsFilter, 
  IdentityDocumentResponseDTO, 
  IdUploadDTO, 
  VerificationDTO 
} from '../data-access/identity-verification.dto';
import { Page } from '../../../shared/models/api.page.model';

export const identityVerificationActions = createActionGroup({
  source: 'Identity Verification',
  events: {
    'Load All Documents': props<{ filter: IdentityDocsFilter }>(),
    'Load All Documents Success': props<{ response: Page<IdentityDocumentResponseDTO> }>(),
    'Load All Documents Failure': props<{ error: ApiError }>(),

    'Load My Documents': props<{ filter: IdentityDocsFilter }>(),
    'Load My Documents Success': props<{ response: Page<IdentityDocumentResponseDTO> }>(),
    'Load My Documents Failure': props<{ error: ApiError }>(),

    'Load Document By Id': props<{ id: string }>(),
    'Load Document By Id Success': props<{ document: IdentityDocumentResponseDTO }>(),
    'Load Document By Id Failure': props<{ error: ApiError }>(),

    'Upload Document': props<{ payload: IdUploadDTO }>(),
    'Upload Document Success': props<{ document: IdentityDocumentResponseDTO }>(),
    'Upload Document Failure': props<{ error: ApiError }>(),

    'Verify Document': props<{ documentId: string; request: VerificationDTO }>(),
    'Verify Document Success': props<{ document: IdentityDocumentResponseDTO }>(),
    'Verify Document Failure': props<{ error: ApiError }>(),

    'Delete Document': props<{ id: string }>(),
    'Delete Document Success': props<{ document: IdentityDocumentResponseDTO }>(),
    'Delete Document Failure': props<{ error: ApiError }>(),
  },
});
