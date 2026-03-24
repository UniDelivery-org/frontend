import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  MapPin,
  Bike,
  Car,
  Truck,
  Wallet,
  Search,
  Map,
  Navigation,
  X,
  Image,
} from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { Map as MapComponent } from '../../../shared/pages/map/map';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { GeolocationService } from '../../../../core/services/geoloaction.service';
import { AnimatedTitleDirective } from '../../../../core/directives/animated-title.directive';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../profile/store/profile.reducer';
import { take } from 'rxjs/operators';
import { senderDeliveryActions } from '../../../sender/store/sender-delivery.actions';
import { DeliveryRequestDTO } from '../../data-access/delivery.dto';

@Component({
  selector: 'app-new-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    MapComponent,
    AnimatedTitleDirective,
    RouterLink,
  ],
  templateUrl: './new-delivery.html',
})
export class NewDeliveryComponent implements OnDestroy {
  private store = inject(Store);
  // Icons
  readonly MapPin = MapPin;
  readonly Bike = Bike;
  readonly Car = Car;
  readonly Truck = Truck;
  readonly Wallet = Wallet;
  readonly Search = Search;
  readonly Map = Map;
  readonly Navigation = Navigation;
  readonly X = X;
  readonly Image = Image;

  @ViewChild('bookingPanel') bookingPanel!: ElementRef;
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  // Map Selection State
  selectingFor: 'pickup' | 'dropoff' | null = null;
  // @ts-ignore
  geocoder = L.Control.Geocoder.nominatim();
  locationSub: any;

  // Form Data
  pickupLocation = '';
  dropoffLocation = '';

  // Delivery Request Form Data
  weightKg: number | null = null;
  note: string = '';
  receiverName: string = '';
  receiverPhone: string = '';
  paymentMethod: string = 'ONLINE_CARD';
  payerType: string = 'SENDER';

  // Exact Map Coordinates
  pickupLatLng: L.LatLng | null = null;
  dropoffLatLng: L.LatLng | null = null;

  isPickupLoading = false;
  isDropoffLoading = false;

  offerPrice: number | null = null;
  selectedVehicle = 'MOTO';
  isSearching = false;

  suggestedPrices = [30, 45, 60, 80];

  routePoints: L.LatLng[] = [];
  geocodeTimer: any;

  packageImages: { url: string | ArrayBuffer | null; file: File }[] = [];

  constructor(
    private geolocationService: GeolocationService,
    private cdr: ChangeDetectorRef,
  ) {}

  setPrice(price: number) {
    this.offerPrice = price;
  }

  onVehicleChange(vehicle: string) {
    this.selectedVehicle = vehicle;
    this.calculateSuggestedPrice();
  }

  onWeightChange() {
    this.calculateSuggestedPrice();
  }

  onLocationChange(type: 'pickup' | 'dropoff') {
    if (type === 'pickup') {
      this.pickupLatLng = null;
    } else {
      this.dropoffLatLng = null;
    }

    clearTimeout(this.geocodeTimer);
    this.geocodeTimer = setTimeout(() => {
      this.geocodeInputsAndRoute();
    }, 1500);
  }

  geocodeInputsAndRoute() {
    let pending = 0;

    if (this.pickupLocation && !this.pickupLatLng) {
      pending++;
      this.geocoder.geocode(this.pickupLocation, (res: any[]) => {
        if (res && res.length > 0) this.pickupLatLng = res[0].center;
        pending--;
        this.checkDrawRoute(pending);
      });
    }

    if (this.dropoffLocation && !this.dropoffLatLng) {
      pending++;
      this.geocoder.geocode(this.dropoffLocation, (res: any[]) => {
        if (res && res.length > 0) this.dropoffLatLng = res[0].center;
        pending--;
        this.checkDrawRoute(pending);
      });
    }

    this.checkDrawRoute(pending);
  }

  checkDrawRoute(pending: number) {
    if (pending === 0) {
      this.updateRoute();
    }
  }

  updateRoute() {
    const points: L.LatLng[] = [];
    if (this.pickupLatLng) points.push(this.pickupLatLng);
    if (this.dropoffLatLng) points.push(this.dropoffLatLng);

    this.routePoints = points;
    this.calculateSuggestedPrice();
    this.cdr.detectChanges();
  }

  calculateSuggestedPrice() {
    if (!this.pickupLatLng || !this.dropoffLatLng) {
      if (!this.offerPrice) this.suggestedPrices = [30, 45, 60, 80];
      return;
    }

    const distanceInMeters = this.pickupLatLng.distanceTo(this.dropoffLatLng);
    const distanceInKm = distanceInMeters / 1000;

    let basePrice = 0;
    let pricePerKm = 0;
    let weightSurcharge = 0;
    
    const weight = this.weightKg || 1;

    switch (this.selectedVehicle) {
      case 'MOTO':
        basePrice = 15;
        pricePerKm = 3;
        if (weight > 5) weightSurcharge = (weight - 5) * 1;
        break;
      case 'CAR':
        basePrice = 30;
        pricePerKm = 5;
        if (weight > 20) weightSurcharge = (weight - 20) * 2;
        break;
      case 'TRUCK':
        basePrice = 100;
        pricePerKm = 10;
        if (weight > 100) weightSurcharge = (weight - 100) * 5;
        break;
    }

    let calculatedPrice = basePrice + (distanceInKm * pricePerKm) + weightSurcharge;
    
    // Round to nearest 5 MAD
    calculatedPrice = Math.ceil(calculatedPrice / 5) * 5;
    
    this.offerPrice = calculatedPrice;

    this.suggestedPrices = [
      calculatedPrice,
      calculatedPrice + 10,
      calculatedPrice + 20,
      calculatedPrice + 50
    ];
  }

  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (this.packageImages.length >= 4) break;
        
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.packageImages.push({
            url: e.target?.result || null,
            file: file
          });
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = '';
  }

  removeImage(index: number) {
    this.packageImages.splice(index, 1);
  }

  private formatAddress(data: any): string {
    if (!data || !data.address) return data?.display_name || '';

    const addr = data.address;
    const parts: string[] = [];

    const mainPlace =
      addr.road ||
      addr.pedestrian ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.amenity ||
      addr.building;
    if (mainPlace) parts.push(mainPlace);

    const city = addr.city || addr.town || addr.village || addr.municipality;
    if (city) parts.push(city);

    if (parts.length > 0) {
      return parts.join(', ');
    }

    return data.display_name || '';
  }

  toggleSelectionMode(type: 'pickup' | 'dropoff') {
    if (this.selectingFor === type) {
      this.selectingFor = null;
    } else {
      this.selectingFor = type;
    }
  }

  zoomIn() {
    if (this.mapComponent && this.mapComponent.map) {
      this.mapComponent.map.zoomIn();
    }
  }

  zoomOut() {
    if (this.mapComponent && this.mapComponent.map) {
      this.mapComponent.map.zoomOut();
    }
  }

  onMapClick(latlng: L.LatLng) {
    if (!this.selectingFor) return;

    const type = this.selectingFor;
    this.selectingFor = null;

    if (type === 'pickup') {
      this.pickupLatLng = latlng;
      this.pickupLocation = 'Loading address...';
      this.isPickupLoading = true;
    } else {
      this.dropoffLatLng = latlng;
      this.dropoffLocation = 'Loading address...';
      this.isDropoffLoading = true;
    }

    this.updateRoute();

    this.geolocationService.reverseGeocode(latlng.lat, latlng.lng).subscribe({
      next: (data) => {
        console.log('Reverse Geocode Native (Map Click):', data);
        let address = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;

        if (data) {
          address = this.formatAddress(data);
        }

        if (type === 'pickup') {
          this.pickupLocation = address;
          this.isPickupLoading = false;
        } else {
          this.dropoffLocation = address;
          this.isDropoffLoading = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Geocoding failed:', err);
        if (type === 'pickup') {
          this.pickupLocation = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
          this.isPickupLoading = false;
        } else {
          this.dropoffLocation = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
          this.isDropoffLoading = false;
        }
        this.cdr.detectChanges();
      },
    });
  }

  useCurrentLocation() {
    this.dropoffLocation = 'Detecting location...';
    this.isDropoffLoading = true;
    this.cdr.detectChanges();

    this.locationSub = this.geolocationService.getPositionStream().subscribe({
      next: (pos) => {
        const coords = L.latLng(pos.coords.latitude, pos.coords.longitude);
        this.dropoffLatLng = coords;
        this.dropoffLocation = 'Loading address...';
        this.updateRoute();

        this.geolocationService.reverseGeocode(coords.lat, coords.lng).subscribe({
          next: (data) => {
            console.log('Reverse Geocode Native (Current Location):', data);
            let address = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

            if (data) {
              address = this.formatAddress(data);
            }

            this.dropoffLocation = address;
            this.isDropoffLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Geocoding failed:', err);
            this.dropoffLocation = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
            this.isDropoffLoading = false;
            this.cdr.detectChanges();
          },
        });

        if (this.locationSub) {
          this.locationSub.unsubscribe();
        }
      },
      error: (err) => {
        console.error('Could not get location', err);
        this.isDropoffLoading = false;
        this.dropoffLocation = '';
        this.cdr.detectChanges();
      },
    });
  }

  findDriver() {
    this.isSearching = true;

    this.store
      .select(selectProfile)
      .pipe(take(1))
      .subscribe((profile) => {
        const requestDTO: DeliveryRequestDTO = {
          senderId: profile?.id || '',
          pickupAddress: this.pickupLocation,
          pickupLat: this.pickupLatLng ? this.pickupLatLng.lat : 0,
          pickupLon: this.pickupLatLng ? this.pickupLatLng.lng : 0,
          dropoffAddress: this.dropoffLocation,
          dropoffLat: this.dropoffLatLng ? this.dropoffLatLng.lat : 0,
          dropoffLon: this.dropoffLatLng ? this.dropoffLatLng.lng : 0,
          vehicleTypeRequired: this.selectedVehicle as any,
          weightKg: this.weightKg || 1,
          note: this.note,
          receiverName: this.receiverName,
          receiverPhone: this.receiverPhone,
          agreedPrice: this.offerPrice || 0,
          paymentMethod: this.paymentMethod as any,
          payerType: this.payerType as any,
        };

        console.log('Dispatching action with payload:', requestDTO);
        this.store.dispatch(senderDeliveryActions.createDelivery({ deliveryRequest: requestDTO }));
      });
  }

  ngOnDestroy() {
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
  }
}
