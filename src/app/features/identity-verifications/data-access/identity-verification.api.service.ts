import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/api.page.model';
import {
  IdentityDocsFilter,
  IdentityDocumentResponseDTO,
  IdUploadDTO,
  VerificationDTO,
} from '../data-access/identity-verification.dto';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityVerificationApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}/identitydocs`;
  private toast = inject(ToastService);

  private mapIdentityDocument(doc: IdentityDocumentResponseDTO): IdentityDocumentResponseDTO {
    if (doc && doc.fileUrl && !doc.fileUrl.startsWith('http')) {
      doc.fileUrl = `http://localhost:8084${doc.fileUrl}`;
    }
    return doc;
  }

  private mapIdentityPage(page: Page<IdentityDocumentResponseDTO>): Page<IdentityDocumentResponseDTO> {
    if (page && page.content) {
      page.content = page.content.map(doc => this.mapIdentityDocument(doc));
    }
    return page;
  }

  /**
   * Get all documents with optional filtering.
   * @param filter The filter criteria.
   */
  getAllDocuments(filter: IdentityDocsFilter): Observable<Page<IdentityDocumentResponseDTO>> {
    const params = this.buildHttpParams(filter);
    return this.http.get<Page<IdentityDocumentResponseDTO>>(this.apiUrl, { params }).pipe(
      map(page => this.mapIdentityPage(page)),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger les documents');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get documents belonging to the current user.
   * @param filter The filter criteria.
   */
  getMyDocuments(filter: IdentityDocsFilter): Observable<Page<IdentityDocumentResponseDTO>> {
    const params = this.buildHttpParams(filter);
    return this.http.get<Page<IdentityDocumentResponseDTO>>(`${this.apiUrl}/my-documents`, {
      params,
    }).pipe(
      map(page => this.mapIdentityPage(page)),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger vos documents');
        return throwError(() => error);
      })
    );
  }

  /**
   * Upload a new identity document.
   * @param payload The upload data including document type and file.
   */
  uploadDocument(payload: IdUploadDTO): Observable<IdentityDocumentResponseDTO> {
    const formData = new FormData();
    formData.append('IdentityDocType', payload.identityDocType);
    formData.append('file', payload.file);

    return this.http.post<IdentityDocumentResponseDTO>(this.apiUrl, formData).pipe(
      map(doc => this.mapIdentityDocument(doc)),
      tap(() => this.toast.show('Document téléchargé avec succès', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de télécharger le document');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a document by its ID.
   * @param id The document ID.
   */
  getDocumentById(id: string): Observable<IdentityDocumentResponseDTO> {
    return this.http.get<IdentityDocumentResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      map(doc => this.mapIdentityDocument(doc)),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de charger le document');
        return throwError(() => error);
      })
    );
  }

  /**
   * Verify an identity document.
   * @param documentId The ID of the document to verify.
   * @param request The verification status and optional rejection reason.
   */
  verifyDocument(
    documentId: string,
    request: VerificationDTO,
  ): Observable<IdentityDocumentResponseDTO> {
    return this.http.put<IdentityDocumentResponseDTO>(
      `${this.apiUrl}/${documentId}/verifiy`,
      request,
    ).pipe(
      map(doc => this.mapIdentityDocument(doc)),
      tap(() => this.toast.show('Document vérifié', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de vérifier le document');
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a document by its ID.
   * @param id The document ID.
   */
  deleteDocument(id: string): Observable<IdentityDocumentResponseDTO> {
    return this.http.delete<IdentityDocumentResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      map(doc => this.mapIdentityDocument(doc)),
      tap(() => this.toast.show('Document supprimé', 'success')),
      catchError((error) => {
        this.toast.showError('Erreur', error.error?.message || 'Impossible de supprimer le document');
        return throwError(() => error);
      })
    );
  }

  /**
   * Helper method to build HttpParams from a filter object.
   */
  private buildHttpParams(filter: IdentityDocsFilter): HttpParams {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}
