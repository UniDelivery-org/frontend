import { Component, inject, DestroyRef } from '@angular/core';
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
import { profileActions } from '../store/profile.actions';
import { UpdateProfileRequestDTO } from '../data-access/update-profile.dto';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  formValues: Partial<Profile> = {};

  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.profile$ = this.store.select(selectProfile);

    // Close edit mode only when the update is successful
    this.actions$
      .pipe(ofType(profileActions.updateProfileSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isEditing = false;
      });
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

  toggleEdit(currentProfile?: Profile | null) {
    this.isEditing = !this.isEditing;
    if (this.isEditing && currentProfile) {
      this.formValues = { ...currentProfile };
    }
  }

  saveProfile() {
    if (this.formValues.fullName && this.formValues.phone) {
      const updateProfileDto: UpdateProfileRequestDTO = {
        fullName: this.formValues.fullName,
        phone: this.formValues.phone,
      };
      this.store.dispatch(profileActions.updateProfile({ updateProfileDto }));
    }
  }
}
