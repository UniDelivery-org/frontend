import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { LeafletDirective, LeafletModule } from '@bluehalo/ngx-leaflet';
import { GeolocationService } from '../../../services/geoloaction-service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-map',
  imports: [LeafletModule, LeafletDirective],
  templateUrl: './map.html',
})
export class Map implements OnInit, OnDestroy {

  map!: L.Map;
  circle!: L.CircleMarker;
  watchSub!: Subscription;

  options: L.MapOptions = {
    layers: [
      L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
        attribution: '© Stamen Design, © OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 20,
        className: 'bw-map-tiles' // <--- ADD THIS CLASS for the CSS filter
      })
    ],
    zoom: 15,
    center: L.latLng(0, 0),
    zoomControl: false // Optional: inDrive usually hides default controls
  };

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit(): void {
    this.watchSub = this.geolocationService.getPositionStream()
      .subscribe({
        next: (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coords = L.latLng(lat, lng);

          if (!this.map) return;

          if (!this.circle) {
            // --- UPDATED CIRCLE STYLING ---
            this.circle = L.circleMarker(coords, {
              radius: 12,           // Size in pixels (fixed)
              color: '#ffffff',     // White border
              weight: 3,            // Border thickness
              fillColor: '#65D54B', // inDrive Green
              fillOpacity: 1        // Solid color
            }).addTo(this.map);

            this.map.setView(coords, 15);
          } else {
            this.circle.setLatLng(coords);
            this.map.panTo(coords);
          }
        },
        error: (err) => console.error(err)
      });
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }

  ngOnDestroy(): void {
    if (this.watchSub) this.watchSub.unsubscribe();
    if (this.map) this.map.off('zoomend');
  }

  private getRadiusForZoom(zoom: number): number {
    const baseZoom = 15;
    const baseRadius = 30;
    return baseRadius * Math.pow(2, baseZoom - zoom);
  }
}
