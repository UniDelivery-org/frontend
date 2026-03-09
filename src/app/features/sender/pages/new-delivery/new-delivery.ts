import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
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
} from 'lucide-angular';
import { Map as MapComponent } from '../../../shared/pages/map/map';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { GeolocationService } from '../../../../core/services/geoloaction.service';
import { AnimatedTitleDirective } from '../../../../core/directives/animated-title.directive';

@Component({
  selector: 'app-new-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, MapComponent, AnimatedTitleDirective],
  templateUrl: './new-delivery.html',
})
export class NewDeliveryComponent implements OnDestroy {
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
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  // Map Selection State
  selectingFor: 'pickup' | 'dropoff' | null = null;
  // @ts-ignore
  geocoder = L.Control.Geocoder.nominatim();
  locationSub: any;

  // Form Data
  pickupLocation = '';
  dropoffLocation = '';

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

  constructor(
    private geolocationService: GeolocationService,
    private cdr: ChangeDetectorRef,
  ) {}

  setPrice(price: number) {
    this.offerPrice = price;
  }

  onLocationChange(type: 'pickup' | 'dropoff') {
    if (type === 'pickup') {
      this.pickupLatLng = null; // Clear previous exact coordinate when searching new text
    } else {
      this.dropoffLatLng = null;
    }

    clearTimeout(this.geocodeTimer);
    this.geocodeTimer = setTimeout(() => {
      this.geocodeInputsAndRoute();
    }, 1500);
  }

  // Only used when the user manually TYPED into the text box
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
    this.cdr.detectChanges();
  }

  private formatAddress(data: any): string {
    if (!data || !data.address) return data?.display_name || '';

    const addr = data.address;
    const parts: string[] = [];

    // 1. Street / Place name
    const mainPlace =
      addr.road ||
      addr.pedestrian ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.amenity ||
      addr.building;
    if (mainPlace) parts.push(mainPlace);

    // 2. City / Town
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

    // Use GeolocationService to reverse geocode
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
        // Fallback to coordinates
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
        this.dropoffLocation = 'Loading address...'; // Set placeholder while fetching address
        this.updateRoute();

        // Use GeolocationService to reverse geocode
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
    console.log('Searching for:', {
      pickup: this.pickupLocation,
      dropoff: this.dropoffLocation,
      vehicle: this.selectedVehicle,
      price: this.offerPrice,
    });

    setTimeout(() => {
      this.isSearching = false;
    }, 3000);
  }

  ngOnDestroy() {
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
  }
}
