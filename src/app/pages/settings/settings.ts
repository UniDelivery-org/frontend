import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation';
import { LucideAngularModule, Bell, Shield, Moon, Globe, LogOut, ChevronRight, User, Smartphone, Lock } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './settings.html'
})
export class SettingsComponent implements AfterViewInit {
  // Icons
  readonly Bell = Bell;
  readonly Shield = Shield;
  readonly Moon = Moon;
  readonly Globe = Globe;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;
  readonly User = User;
  readonly Smartphone = Smartphone;
  readonly Lock = Lock;

  sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', desc: 'Update your profile details' },
        { icon: Lock, label: 'Security & Password', desc: 'Manage your password and 2FA' },
        { icon: Smartphone, label: 'Devices', desc: 'Manage connected devices' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Customize your alert preferences' },
        { icon: Moon, label: 'Appearance', desc: 'Toggle dark mode (System Default)' },
        { icon: Globe, label: 'Language', desc: 'English (US)' }
      ]
    }
  ];

  constructor(private animService: AnimationService) {}

  ngAfterViewInit() {
    this.animService.staggerFadeIn('.settings-item', 0.1);
  }

  logout() {
    console.log('Logging out...');
  }
}
