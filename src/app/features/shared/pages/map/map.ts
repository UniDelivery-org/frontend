import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { LeafletDirective, LeafletModule } from '@bluehalo/ngx-leaflet';
import { LucideAngularModule, Map as MapIcon, ChevronDown, Navigation, Route } from 'lucide-angular';

// Fix missing marker icons in leaflet 1.9+
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
import { Subscription } from 'rxjs';
import { GeolocationService } from '../../../../core/services/geoloaction-service';
import { PathService } from '../../../../core/services/path-service';
import 'leaflet-routing-machine';

export interface InstructionStep {
  type: string;
  modifier: string;
  name: string;
  distance: number;
  duration: number;
}

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  imports: [LeafletModule, LeafletDirective, CommonModule, LucideAngularModule],
  templateUrl: './map.html',
  host: {
    'class': 'block w-full h-full'
  }
})
export class Map implements OnInit, OnDestroy, OnChanges {
  readonly MapIcon = MapIcon;
  readonly ChevronDown = ChevronDown;
  readonly Navigation = Navigation;
  readonly Route = Route;

  @Input() showTracking: boolean = true;
  @Input() routePoints: L.LatLng[] = [];
  @Input() set routingData(data: any) {
    if (data) {
      this.parseRoutingData(data);
    }
  }
  @Output() mapClick = new EventEmitter<L.LatLng>();

  instructionSteps: InstructionStep[] = [];
  showDirections: boolean = false;
  totalDistance: number = 0;
  totalDuration: number = 0;


  map!: L.Map;
  circle!: L.CircleMarker;
  pathLine!: L.Polyline;
  watchSub!: Subscription;
  routingControl: any;

  options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxNativeZoom: 19,
        maxZoom: 20,
        className: 'bw-map-tiles'
      })
    ],
    zoom: 13,
    center: L.latLng(30.4278, -9.5981),
    zoomControl: false
  };

  constructor(
    private geolocationService: GeolocationService,
    private pathService: PathService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.showTracking) {
      this.startTracking();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['routePoints'] && this.routePoints && this.routePoints.length >= 1 && this.map) {
      this.drawRoute();
    }
  }

  private createCustomMarker(type: 'pickup' | 'dropoff' | 'live', latlng: L.LatLng): L.Marker {
    const label = type === 'pickup' ? 'A' : type === 'dropoff' ? 'B' : '';
    const colorClass = type === 'pickup' ? 'uni-marker-pickup' : type === 'dropoff' ? 'uni-marker-dropoff' : 'uni-marker-live';
    const pulseClass = type === 'pickup' ? 'uni-pulse-pickup' : type === 'dropoff' ? 'uni-pulse-dropoff' : 'uni-pulse-live';

    const html = `
      <div class="uni-marker-container">
        <div class="uni-marker-pulse ${pulseClass}"></div>
        <div class="uni-marker-pin ${colorClass}">${label}</div>
      </div>
    `;

    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'uni-custom-div-icon',
        html: html,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
      interactive: true,
      zIndexOffset: 1000
    });
  }

  drawRoute() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    
    this.map.eachLayer((layer) => {
      // @ts-ignore
      if (layer instanceof L.Marker && layer.options.icon && layer.options.icon.options.className === 'uni-custom-div-icon') {
        this.map.removeLayer(layer);
      }
      // @ts-ignore
      if (layer instanceof L.CircleMarker && layer.options.radius === 12) {
        this.map.removeLayer(layer);
      }
    });

    if (this.routePoints.length > 0) {
       this.createCustomMarker('pickup', this.routePoints[0]).addTo(this.map);

       if (this.routePoints.length > 1) {
          this.createCustomMarker('dropoff', this.routePoints[1]).addTo(this.map);
       }
       
       this.map.setView(this.routePoints[0], 13);
       
       if (this.routePoints.length > 1) {
         // @ts-ignore
         this.routingControl = L.Routing.control({
           waypoints: this.routePoints,
           routeWhileDragging: false,
           showAlternatives: false,
           fitSelectedRoutes: true,
           lineOptions: {
             styles: [{ color: '#65D54B', weight: 6, opacity: 1.0, lineCap: 'round', lineJoin: 'round' }]
           },
           show: false,
           createMarker: function() { return null; }
         }).addTo(this.map);
       }
    }
  }

  startTracking() {
    this.watchSub = this.geolocationService.getPositionStream()
      .subscribe({
        next: (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coords = L.latLng(lat, lng);

          if (!this.map) return;

          if (!this.circle) {
            this.circle = this.createCustomMarker('live', coords).addTo(this.map) as any;

            const savedPath = this.pathService.getSavedPath();
            
            this.pathLine = L.polyline(savedPath, {
              color: '#65D54B',
              weight: 8,
              opacity: 1.0,
              lineCap: 'round',
              lineJoin: 'round',
              smoothFactor: 1.0
            }).addTo(this.map);

            this.map.setView(coords, 15);
            
          } else {
            this.circle.setLatLng(coords);
            this.map.panTo(coords);

            if (this.pathLine) {
              this.pathLine.addLatLng(coords); 
              this.pathService.addPoint(coords); 
            }
          }
        },
        error: (err) => console.error(err)
      });
  }

  private parseRoutingData(data: any) {
    if (!data || !data.routes || !data.routes[0]) {
      this.instructionSteps = [];
      return;
    }

    const route = data.routes[0];
    this.totalDistance = route.distance;
    this.totalDuration = route.duration;

    const steps = route.legs[0].steps;
    this.instructionSteps = steps.map((s: any) => ({
      type: s.maneuver.type,
      modifier: s.maneuver.modifier,
      name: s.name,
      distance: s.distance,
      duration: s.duration
    }));
    
    if (this.instructionSteps.length > 0) {
      this.showDirections = true;
    }
    this.cdr.detectChanges();
  }

  toggleDirections() {
    this.showDirections = !this.showDirections;
    this.cdr.detectChanges();
  }


  onMapReady(map: L.Map) {
    this.map = map;

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.mapClick.emit(e.latlng);
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
    if (this.routePoints && this.routePoints.length >= 1) {
      this.drawRoute();
    }
  }

  ngOnDestroy(): void {
    if (this.watchSub) this.watchSub.unsubscribe();
  }
}