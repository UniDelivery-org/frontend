import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  reverseGeocode(lat: number, lng: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    return this.http.get<any>(url);
  }

  getRoute(pickup: {lat: number, lng: number}, dropoff: {lat: number, lng: number}): Observable<any> {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=false&alternatives=true&steps=true`;
    return this.http.get<any>(url);
  }

  getPositionStream(): Observable<GeolocationPosition> {
    return new Observable((observer: Observer<GeolocationPosition>) => {

      if (!navigator.geolocation) {
        observer.error('Geolocation not supported in this browser.');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => {
          observer.next(position);
        },
        (error: GeolocationPositionError) => {
          observer.error(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    });
  }
}