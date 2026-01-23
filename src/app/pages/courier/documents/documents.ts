import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, Clock, FileUp, Upload, Eye, AlertCircle, ShieldCheck } from 'lucide-angular';
import { VerificationStatus } from '../../../core/models/models';

interface DocItem {
  id: number;
  title: string;
  description: string;
  status: VerificationStatus | 'MISSING';
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './documents.html'
})
export class DocumentsComponent {
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

  // Mock Data
  documents: DocItem[] = [
    { 
      id: 1, 
      title: 'National ID (CIN)', 
      description: 'Front and back photo of your ID card.', 
      status: VerificationStatus.APPROVED 
    },
    { 
      id: 2, 
      title: 'Driver License', 
      description: 'Valid Permis B or C.', 
      status: VerificationStatus.PENDING 
    },
    { 
      id: 3, 
      title: 'Vehicle Registration (Carte Grise)', 
      description: 'Must match your license plate.', 
      status: 'MISSING' 
    },
    { 
      id: 4, 
      title: 'Insurance Paper', 
      description: 'Valid at least for next 3 months.', 
      status: VerificationStatus.REJECTED 
    }
  ];

  getProgress() {
    const approved = this.documents.filter(d => d.status === VerificationStatus.APPROVED).length;
    return Math.round((approved / this.documents.length) * 100);
  }

  uploadFile(id: number) {
    console.log('Open file picker for doc:', id);
  }
}