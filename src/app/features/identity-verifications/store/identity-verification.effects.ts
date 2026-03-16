import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { identityVerificationActions } from './identity-verification.actions';
import { IdentityVerificationApiService } from '../data-access/identity-verification.api.service';

export const loadAllDocumentsEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(IdentityVerificationApiService)) =>
    actions$.pipe(
      ofType(identityVerificationActions.loadAllDocuments),
      mergeMap(({ filter }) =>
        apiService.getAllDocuments(filter).pipe(
          map((response) => identityVerificationActions.loadAllDocumentsSuccess({ response })),
          catchError((error) => of(identityVerificationActions.loadAllDocumentsFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadMyDocumentsEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(IdentityVerificationApiService)) =>
    actions$.pipe(
      ofType(identityVerificationActions.loadMyDocuments),
      mergeMap(({ filter }) =>
        apiService.getMyDocuments(filter).pipe(
          map((response) => identityVerificationActions.loadMyDocumentsSuccess({ response })),
          catchError((error) => of(identityVerificationActions.loadMyDocumentsFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const loadDocumentByIdEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(IdentityVerificationApiService)) =>
    actions$.pipe(
      ofType(identityVerificationActions.loadDocumentById),
      mergeMap(({ id }) =>
        apiService.getDocumentById(id).pipe(
          map((document) => identityVerificationActions.loadDocumentByIdSuccess({ document })),
          catchError((error) => of(identityVerificationActions.loadDocumentByIdFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const uploadDocumentEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(IdentityVerificationApiService)) =>
    actions$.pipe(
      ofType(identityVerificationActions.uploadDocument),
      mergeMap(({ payload }) =>
        apiService.uploadDocument(payload).pipe(
          map((document) => identityVerificationActions.uploadDocumentSuccess({ document })),
          catchError((error) => of(identityVerificationActions.uploadDocumentFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const verifyDocumentEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(IdentityVerificationApiService)) =>
    actions$.pipe(
      ofType(identityVerificationActions.verifyDocument),
      mergeMap(({ documentId, request }) =>
        apiService.verifyDocument(documentId, request).pipe(
          map((document) => identityVerificationActions.verifyDocumentSuccess({ document })),
          catchError((error) => of(identityVerificationActions.verifyDocumentFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const deleteDocumentEffect = createEffect(
  (actions$ = inject(Actions), apiService = inject(IdentityVerificationApiService)) =>
    actions$.pipe(
      ofType(identityVerificationActions.deleteDocument),
      mergeMap(({ id }) =>
        apiService.deleteDocument(id).pipe(
          map((document) => identityVerificationActions.deleteDocumentSuccess({ document })),
          catchError((error) => of(identityVerificationActions.deleteDocumentFailure({ error }))),
        ),
      ),
    ),
  { functional: true },
);
