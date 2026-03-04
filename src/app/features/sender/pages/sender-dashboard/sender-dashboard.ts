import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Box, Clock, Home, MapPin, BadgeCheck, TrendingUp, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-sender-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './sender-dashboard.html'
})
export class SenderDashboardComponent {
  // Icons
  readonly Box = Box;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly BadgeCheck = BadgeCheck;
  readonly TrendingUp = TrendingUp;
  readonly ArrowRight = ArrowRight;
  readonly Home = Home;

  // Mock Stats
  stats = [
    { label: 'Active Deliveries', value: '3', icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Total Spent', value: '450 DH', icon: TrendingUp, color: 'text-uni-500', bg: 'bg-uni-500/10', border: 'border-uni-500/20' },
    { label: 'Completed', value: '12', icon: BadgeCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
  ];

  // Mock Active Deliveries
  activeDeliveries = [
    {
      id: 'DEL-8821',
      pickup: 'Marjane Market, Gueliz',
      dropoff: 'Residence Al Yassamine',
      status: 'PICKED_UP', // PENDING, PICKED_UP, IN_TRANSIT, DELIVERED
      statusLabel: 'Picked Up',
      price: 45,
      driver: 'Ahmed B.',
      time: '15 mins ago'
    },
    {
      id: 'DEL-9932',
      pickup: 'Zara Store, Carré Eden',
      dropoff: 'Villa 45, Targa',
      status: 'PENDING',
      statusLabel: 'Finding Driver',
      price: 30,
      driver: null,
      time: '2 mins ago'
    },
    {
      id: 'DEL-7721',
      pickup: 'Pharmacy Atlas',
      dropoff: 'Hotel Mamounia Staff Entrance',
      status: 'IN_TRANSIT',
      statusLabel: 'On the way',
      price: 60,
      driver: 'Karim S.',
      time: '25 mins ago'
    }
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'PICKED_UP': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'IN_TRANSIT': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'DELIVERED': return 'text-uni-500 bg-uni-500/10 border-uni-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  }
}