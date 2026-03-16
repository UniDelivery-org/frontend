import { createFeature, createReducer, on } from '@ngrx/store';
import { identityVerificationActions } from './identity-verification.actions';
import { IdentityVerificationState } from './identity-verification.state';

const initialState: IdentityVerificationState = {
  documents: [],
  myDocuments: [],
  selectedDocument: null,
  isLoading: false,
  error: null,
  totalElements: 0,
};

export const identityVerificationFeature = createFeature({
  name: 'identityVerification',
  reducer: createReducer(
    initialState,

    // Load All Documents
    on(identityVerificationActions.loadAllDocuments, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(identityVerificationActions.loadAllDocumentsSuccess, (state, { response }) => ({
      ...state,
      documents: response.content,
      totalElements: response.totalElements,
      isLoading: false,
    })),
    on(identityVerificationActions.loadAllDocumentsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Load My Documents
    on(identityVerificationActions.loadMyDocuments, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(identityVerificationActions.loadMyDocumentsSuccess, (state, { response }) => ({
      ...state,
      myDocuments: response.content,
      totalElements: response.totalElements,
      isLoading: false,
    })),
    on(identityVerificationActions.loadMyDocumentsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Load Document By Id
    on(identityVerificationActions.loadDocumentById, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(identityVerificationActions.loadDocumentByIdSuccess, (state, { document }) => ({
      ...state,
      selectedDocument: document,
      isLoading: false,
    })),
    on(identityVerificationActions.loadDocumentByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Upload Document
    on(identityVerificationActions.uploadDocument, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(identityVerificationActions.uploadDocumentSuccess, (state, { document }) => ({
      ...state,
      myDocuments: [document, ...state.myDocuments],
      isLoading: false,
    })),
    on(identityVerificationActions.uploadDocumentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Verify Document
    on(identityVerificationActions.verifyDocument, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(identityVerificationActions.verifyDocumentSuccess, (state, { document }) => ({
      ...state,
      documents: state.documents.map((d) => (d.id === document.id ? document : d)),
      selectedDocument: state.selectedDocument?.id === document.id ? document : state.selectedDocument,
      isLoading: false,
    })),
    on(identityVerificationActions.verifyDocumentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Delete Document
    on(identityVerificationActions.deleteDocument, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(identityVerificationActions.deleteDocumentSuccess, (state, { document }) => ({
      ...state,
      documents: state.documents.filter((d) => d.id !== document.id),
      myDocuments: state.myDocuments.filter((d) => d.id !== document.id),
      selectedDocument: document,
      isLoading: false,
    })),
    on(identityVerificationActions.deleteDocumentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
  ),
});

export const {
  name: identityVerificationFeatureKey,
  reducer: identityVerificationReducer,
  selectIdentityVerificationState,
  selectDocuments,
  selectMyDocuments,
  selectSelectedDocument,
  selectIsLoading,
  selectError,
  selectTotalElements,
} = identityVerificationFeature;
