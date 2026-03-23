import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, FileText, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './terms.html'
})
export class TermsComponent {
  readonly FileText = FileText;
  readonly ArrowLeft = ArrowLeft;

  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
