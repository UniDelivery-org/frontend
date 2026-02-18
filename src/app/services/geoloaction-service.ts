import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
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