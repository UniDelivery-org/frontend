import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArrowRight, Car, Lock, LucideAngularModule, Mail, Package, Phone, User } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Lock = Lock;
  readonly Package = Package;
  readonly Car = Car;
  readonly ArrowRight = ArrowRight;

  registerForm: FormGroup;
  selectedRole: 'SENDER' | 'COURIER' = 'SENDER';
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      role: ['SENDER', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setRole(role: 'SENDER' | 'COURIER') {
    this.selectedRole = role;
    this.registerForm.get('role')?.setValue(role);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log('Registering as:', this.selectedRole, this.registerForm.value);
      
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }
}