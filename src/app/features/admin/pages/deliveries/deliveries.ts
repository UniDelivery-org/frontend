import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { adminDeliveryActions } from '../../store/admin-delivery.actions';
import { selectAllDeliveries, selectIsLoading } from '../../store/admin-delivery.reducer';
import {
  LucideAngularModule,
  Search,
  Funnel,
  EllipsisVertical,
  MapPin,
  Truck,
  Box,
  Ban,
  CheckCircle,
  Package,
} from 'lucide-angular';

@Component({
  selector: 'app-admin-deliveries',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './deliveries.html',
})
export class AdminDeliveriesComponent implements OnInit {
  private store = inject(Store);

  // Icons
  readonly Search = Search;
  readonly Filter = Funnel;
  readonly MoreVertical = EllipsisVertical;
  readonly MapPin = MapPin;
  readonly Truck = Truck;
  readonly Box = Box;
  readonly Ban = Ban;
  readonly CheckCircle = CheckCircle;
  readonly Package = Package;

  // State
  deliveriesPage = this.store.selectSignal(selectAllDeliveries);
  isLoading = this.store.selectSignal(selectIsLoading);

  ngOnInit() {
    this.store.dispatch(adminDeliveryActions.loadAllDeliveries({ page: 0, size: 20 }));
  }

  forceCancel(deliveryId: string) {
    if (confirm('Are you sure you want to force-cancel this delivery?')) {
      this.store.dispatch(
        adminDeliveryActions.cancelDelivery({ deliveryId, reason: 'Admin Force Cancel' }),
      );
    }
  }
}
