import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../../services/animation';
import { User, Role } from '../../../core/models/models';
import { LucideAngularModule, Search, Shield, User as UserIcon, Mail, Ban, Trash2, Bike, Package, CircleAlert, CircleCheckBig, CircleX, EllipsisVertical, Funnel } from 'lucide-angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './users.html'
})
export class Users implements AfterViewInit {
  // Icons
  readonly Search = Search;
  readonly Filter = Funnel;
  readonly MoreVertical = EllipsisVertical;
  readonly Shield = Shield;
  readonly User = UserIcon;
  readonly Mail = Mail;
  readonly CheckCircle = CircleCheckBig;
  readonly XCircle = CircleX;
  readonly AlertCircle = CircleAlert;
  readonly Ban = Ban;
  readonly Trash2 = Trash2;
  readonly Bike = Bike;
  readonly Package = Package;

  @ViewChildren('tableRow') tableRows!: QueryList<ElementRef>;

  constructor(private animService: AnimationService) {}

  ngAfterViewInit() {
    this.animService.staggerFadeIn(this.tableRows.map(c => c.nativeElement), 0.1);
  }

  users: User[] = [
    { 
      id: '1', 
      name: 'Ahmed T.', 
      role: Role.SENDER, 
      email: 'ahmed@mail.com', 
      isBlocked: false,
      phone: '+212600000001',
      rating: 4.8,
      city: 'Casablanca'
    },
    { 
      id: '2', 
      name: 'Karim B.', 
      role: Role.COURIER, 
      email: 'karim@mail.com',
      isBlocked: false,
      phone: '+212600000002',
      rating: 4.5,
      city: 'Rabat'
    },
    { 
      id: '3', 
      name: 'Fatima Z.', 
      role: Role.SENDER, 
      email: 'fatima@mail.com', 
      isBlocked: true,
      phone: '+212600000003',
      rating: 3.9,
      city: 'Marrakech'
    },
    { 
      id: '4', 
      name: 'Youssef R.', 
      role: Role.COURIER, 
      email: 'youssef@mail.com', 
      isBlocked: false,
      phone: '+212600000004',
      rating: 4.2,
      city: 'Tangier'
    },
    { 
      id: '5', 
      name: 'Omar K.', 
      role: Role.SENDER, 
      email: 'omar@mail.com', 
      isBlocked: false,
      phone: '+212600000005',
      rating: 5.0,
      city: 'Agadir'
    },
    { 
      id: '6', 
      name: 'Salma D.', 
      role: Role.COURIER, 
      email: 'salma@mail.com', 
      isBlocked: false,
      phone: '+212600000006',
      rating: 4.7,
      city: 'Fes'
    },
  ];

  toggleBlock(user: User) {
    user.isBlocked = !user.isBlocked;
  }
}
