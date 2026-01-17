import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../../services/animation';
import { VerificationStatus, IdentityType, VehicleDocumentType } from '../../../core/models/models';
import { LucideAngularModule, Search, Filter, CheckCircle, XCircle, Eye, FileText, ChevronRight, Check, X, SlidersHorizontal, ArrowUpRight } from 'lucide-angular';

interface VerificationRequest {
  id: number;
  user: string;
  type: string;
  url: string;
  status: VerificationStatus;
  date: string;
}

@Component({
  selector: 'app-verifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './verifications.html'
})
export class VerificationsComponent implements AfterViewInit {
  // Icons
  readonly Search = Search;
  readonly Filter = Filter;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Eye = Eye;
  readonly FileText = FileText;
  readonly ChevronRight = ChevronRight;
  readonly Check = Check;
  readonly X = X;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly ArrowUpRight = ArrowUpRight;

  @ViewChildren('docCard') docCards!: QueryList<ElementRef>;

  // Expose Enum to Template
  readonly VerificationStatus = VerificationStatus;

  constructor(private animService: AnimationService) {}

  ngAfterViewInit() {
    this.animService.staggerFadeIn(this.docCards.map(c => c.nativeElement), 0.1);
  }

  docs: VerificationRequest[] = [
    { id: 1, user: 'Karim Benz', type: IdentityType.CIN, url: 'https://placehold.co/600x400/1e293b/cbd5e1?text=CIN+Front', status: VerificationStatus.PENDING, date: '2 mins ago' },
    { id: 2, user: 'Karim Benz', type: IdentityType.DRIVERS_LICENSE, url: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Permis', status: VerificationStatus.PENDING, date: '5 mins ago' },
    { id: 3, user: 'Sara Smith', type: VehicleDocumentType.CARTE_GRISE, url: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Carte+Grise', status: VerificationStatus.PENDING, date: '15 mins ago' },
    { id: 4, user: 'John Doe', type: IdentityType.PASSPORT, url: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Passport', status: VerificationStatus.APPROVED, date: '1 hour ago' },
    { id: 5, user: 'Lina K.', type: 'CIN Back', url: 'https://placehold.co/600x400/1e293b/cbd5e1?text=CIN+Back', status: VerificationStatus.REJECTED, date: '2 hours ago' },
  ];

  approve(id: number) {
    console.log(`Document #${id} approved`);
  }

  reject(id: number) {
    console.log(`Document #${id} rejected`);
  }
}
