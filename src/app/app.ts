import { Component, signal, AfterViewInit, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Lenis from 'lenis';
import { AuthHelper } from './core/helpers/auth.helper';
import { Store } from '@ngrx/store';
import { profileActions } from './features/profile/store/profile.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnInit {
  protected readonly title = signal('UniDelivery');
  private store = inject(Store);
  private authHelper = inject(AuthHelper);

  ngOnInit(): void {
    const isAuth = this.authHelper.isAuthenticated();
    if (isAuth) {
      this.store.dispatch(profileActions.loadProfile());
    }
  }
  ngAfterViewInit() {
    /*
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    */
  }
}
