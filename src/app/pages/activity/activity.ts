import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation';
import { LucideAngularModule, Package, Clock, MapPin, ChevronRight, CheckCircle, XCircle } from 'lucide-angular';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './activity.html'
})
export class ActivityComponent implements AfterViewInit {
  // Icons
  readonly Package = Package;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly ChevronRight = ChevronRight;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  @ViewChildren('activityItem') activityItems!: QueryList<ElementRef>;

  constructor(private animService: AnimationService) {}

  ngAfterViewInit() {
    this.animService.staggerFadeIn(this.activityItems.map(c => c.nativeElement), 0.1);
  }

  activities = [
    { id: '#ORD-7829', title: 'Delivery to Casablanca', date: 'Today, 2:30 PM', price: '45 DH', status: 'COMPLETED' },
    { id: '#ORD-7810', title: 'Package from Rabbit', date: 'Yesterday, 10:15 AM', price: '30 DH', status: 'COMPLETED' },
    { id: '#ORD-7755', title: 'Document to TechPark', date: 'Jan 28, 4:00 PM', price: '60 DH', status: 'CANCELLED' },
    { id: '#ORD-7701', title: 'Groceries Delivery', date: 'Jan 25, 11:00 AM', price: '25 DH', status: 'COMPLETED' },
  ];
}
