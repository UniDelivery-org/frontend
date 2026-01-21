import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Navigation, ArrowRight, Power, MapPin } from 'lucide-angular';
import gsap from 'gsap';

@Component({
  selector: 'app-courier-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './courier-dashboard.html',
})
export class CourierDashboardComponent implements AfterViewInit {
  // Icons
  readonly Navigation = Navigation;
  readonly ArrowRight = ArrowRight;
  readonly Power = Power;
  readonly MapPin = MapPin;

  @ViewChildren('jobCard') jobCards!: QueryList<ElementRef>;

  isOnline = false;

  // Mock Data
  requests = [
    { 
      id: 1, 
      passenger: 'Sarah Benali', 
      distance: '0.8 km', 
      price: 45, 
      pickup: 'Marjane Market, California, Casablanca', 
      dropoff: 'Residence Al Yassamine, Sidi Maarouf' 
    },
    { 
      id: 2, 
      passenger: 'Youssef Tazi', 
      distance: '2.1 km', 
      price: 70, 
      pickup: 'Technopark, Route de Nouaceur', 
      dropoff: 'Gare Casa Voyageurs, Belvedere' 
    }
  ];

  toggleStatus() {
    this.isOnline = !this.isOnline;
    
    if (this.isOnline) {
      setTimeout(() => {
        gsap.from(this.jobCards.map(el => el.nativeElement), {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.2)'
        });
      }, 100); 
    }
  }

  acceptRequest(id: number) {
    console.log('Accepted Request:', id);
  }

  ngAfterViewInit() {
  }
}