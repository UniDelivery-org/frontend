import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, Clock, FileUp, Upload, Eye, AlertCircle, ShieldCheck } from 'lucide-angular';
import { VerificationStatus, IdentityType } from '../../../../core/models/models';
import { Store } from '@ngrx/store';
import { identityVerificationActions } from '../../../identity-verifications/store/identity-verification.actions';
import { selectMyDocuments, selectIsLoading } from '../../../identity-verifications/store/identity-verification.reducer';

interface DocRequirement {
  type: IdentityType;
  title: string;
  description: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './documents.html'
})
export class DocumentsComponent implements OnInit {
  private store = inject(Store);

  // Icons
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly FileUp = FileUp;
  readonly Upload = Upload;
  readonly Eye = Eye;
  readonly AlertCircle = AlertCircle;
  readonly ShieldCheck = ShieldCheck;

  // Expose Enum
  readonly VerificationStatus = VerificationStatus;
  readonly IdentityType = IdentityType;

  // NgRx State
  myDocuments = this.store.selectSignal(selectMyDocuments);
  isLoading = this.store.selectSignal(selectIsLoading);

  // Requirements defined by types supported in the store
  requirements: DocRequirement[] = [
    { 
      type: IdentityType.CIN, 
      title: 'National ID (CIN)', 
      description: 'Front and back photo of your ID card.'
    },
    { 
      type: IdentityType.DRIVERS_LICENSE, 
      title: 'Driver License', 
      description: 'Valid Permis B or C.'
    },
    { 
      type: IdentityType.PASSPORT, 
      title: 'Passport', 
      description: 'Optional if CIN is provided, but recommended.'
    }
  ];

  ngOnInit() {
    this.store.dispatch(identityVerificationActions.loadMyDocuments({ filter: {} }));
  }

  // Helper to find document in store by type
  getDocByType(type: IdentityType) {
    return this.myDocuments().find(d => d.type === type);
  }

  getDocStatus(type: IdentityType): VerificationStatus | 'MISSING' {
    const doc = this.getDocByType(type);
    return doc ? doc.verificationStatus : 'MISSING';
  }

  getProgress = computed(() => {
    const docs = this.myDocuments();
    if (this.requirements.length === 0) return 0;
    const approved = this.requirements.filter(req => {
      const doc = docs.find(d => d.type === req.type);
      return doc?.verificationStatus === VerificationStatus.APPROVED;
    }).length;
    return Math.round((approved / this.requirements.length) * 100);
  });

  triggerUpload(type: IdentityType) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.store.dispatch(identityVerificationActions.uploadDocument({
          payload: {
            identityDocType: type,
            file: file
          }
        }));
      }
    };
    input.click();
  }

  viewDocument(url: string) {
    window.open(url, '_blank');
  }
}