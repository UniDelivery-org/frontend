import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ShieldCheck, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './privacy.html'
})
export class PrivacyComponent {
  readonly ShieldCheck = ShieldCheck;
  readonly ArrowLeft = ArrowLeft;

  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
