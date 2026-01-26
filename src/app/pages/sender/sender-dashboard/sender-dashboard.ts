import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MapPin, Bike, Car, Truck, Wallet, Search, Map, Navigation } from 'lucide-angular';
import gsap from 'gsap';

@Component({
  selector: 'app-sender-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './sender-dashboard.html'
})
export class SenderDashboardComponent implements AfterViewInit {
  // Icons
  readonly MapPin = MapPin;
  readonly Bike = Bike;
  readonly Car = Car;
  readonly Truck = Truck;
  readonly Wallet = Wallet;
  readonly Search = Search;
  readonly Map = Map;
  readonly Navigation = Navigation;

  @ViewChild('bookingPanel') bookingPanel!: ElementRef;

  // Form Data
  pickupLocation = '';
  dropoffLocation = '';
  offerPrice: number | null = null;
  selectedVehicle = 'MOTO';
  isSearching = false;

  suggestedPrices = [30, 45, 60, 80];

  setPrice(price: number) {
    this.offerPrice = price;
  }

  findDriver() {
    this.isSearching = true;
    console.log('Searching for:', {
      pickup: this.pickupLocation,
      dropoff: this.dropoffLocation,
      vehicle: this.selectedVehicle,
      price: this.offerPrice
    });

    setTimeout(() => {
      this.isSearching = false;
    }, 3000);
  }

  ngAfterViewInit() {
    gsap.to(this.bookingPanel.nativeElement, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2
    });
  }
}