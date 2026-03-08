import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Camera, User, Mail, Phone, BadgeCheck, Star, Edit2, Lock, LogOut } from 'lucide-angular';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {
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
  isLoading = false;

  user: UserProfile = {
    fullName: 'Achraf Sikal',
    email: 'achraf.sikal@example.com',
    phone: '+212 600 123 456',
    avatar: null
  };

  logout() {
    console.log('Logging out...');
    
  }
  getAvatar(user: UserProfile): string {
    return user.avatar?user.avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed='+user.fullName.substring(0, user.fullName.indexOf(' '));
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.isLoading = true;
    console.log('Saving profile...', this.user);
    
    setTimeout(() => {
      this.isEditing = false;
      this.isLoading = false;
    }, 1000);
  }
}