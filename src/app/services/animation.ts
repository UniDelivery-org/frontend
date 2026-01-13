import { Injectable } from '@angular/core';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  
  constructor() { }

  staggerFadeIn(elements: any, delay: number = 0) {
    gsap.fromTo(elements, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: delay }
    );
  }

  slideIn(element: any, fromMultiplier: number = 100) {
    gsap.fromTo(element,
      { x: fromMultiplier, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }
}
