import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Camera,
  User,
  Mail,
  Phone,
  BadgeCheck,
  Star,
  Edit2,
  Lock,
  LogOut,
} from 'lucide-angular';
import { Observable } from 'rxjs';
import { Profile } from '../profile';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectProfile } from '../store/profile.reducer';
import { AnimatedTitleDirective } from '../../../core/directives/animated-title.directive';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AnimatedTitleDirective],
  templateUrl: './profile.html',
})
export class ProfileComponent {
  private store = inject(Store);
  // Icons
  readonly Camera = Camera;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly BadgeCheck = BadgeCheck;
  readonly Star = Star;
  readonly Edit2 = Edit2;
  readonly Lock = Lock;
  readonly LogOut = LogOut;

  isEditing = false;
  isLoading$: Observable<boolean>;
  profile$: Observable<Profile | null>;
  constructor() {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.profile$ = this.store.select(selectProfile);
  }

  logout() {
    console.log('Logging out...');
  }
  getAvatar(profile: Profile): string {
    return profile.avatarUrl
      ? profile.avatarUrl
      : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' +
          profile.fullName.substring(0, profile.fullName.indexOf(' '));
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {

  }
}
