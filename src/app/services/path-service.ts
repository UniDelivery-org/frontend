import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class PathService {
  private readonly STORAGE_KEY = 'user_path_trace';
  private lastSaveTime = 0;
  getSavedPath(): L.LatLng[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((c: any) => L.latLng(c.lat, c.lng));
  }

  addPoint(latlng: L.LatLng): void {
    const now = Date.now();
    const currentPath = this.getSavedPath();
    const lastPoint = currentPath[currentPath.length - 1];
    const smallPeriod = now - this.lastSaveTime < 1000;
    const smallDistance = lastPoint && lastPoint.distanceTo(latlng) < 1;
    if (smallPeriod || smallDistance) {
        return;
    }
    
    currentPath.push(latlng); 
    
    const simplePath = currentPath.map(p => ({ lat: p.lat, lng: p.lng }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(simplePath));
    this.lastSaveTime = now;
  }

  clearPath() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}