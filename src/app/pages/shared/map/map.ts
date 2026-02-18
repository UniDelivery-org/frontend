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
  circle!: L.Circle;
  watchSub!: Subscription;

  options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 30,
        attribution: '...'
      })
    ],
    zoom: 15,
    center: L.latLng(0, 0)
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
            this.circle = L.circle(coords, {
              radius: this.getRadiusForZoom(this.map.getZoom())
            }).addTo(this.map);

            this.map.setView(coords, 15);
            this.map.on('zoomend', () => {
              const zoom = this.map.getZoom();
              const newRadius = this.getRadiusForZoom(zoom);
              this.circle.setRadius(newRadius);
            });

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
    if (this.watchSub) {
      this.watchSub.unsubscribe();
    }

    if (this.map) {
      this.map.off('zoomend');
    }
  }

  private getRadiusForZoom(zoom: number): number {
    const baseZoom = 15;
    const baseRadius = 20;

    return baseRadius * Math.pow(2, baseZoom - zoom);
  }
}
