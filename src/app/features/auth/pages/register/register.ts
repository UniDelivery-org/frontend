import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertCircle, ArrowRight, Car, CircleAlert, Lock, LucideAngularModule, Mail, Package, Phone, User } from 'lucide-angular';
import { passwordMatchValidator } from '../../../../core/validators/passwordMatch.validator';

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
  readonly AlertCircle = CircleAlert;

  registerForm: FormGroup;
  selectedRole: 'SENDER' | 'COURIER' = 'SENDER';
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
        role: ['SENDER', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      }, { validators: passwordMatchValidator }
    );
  }

  setRole(role: 'SENDER' | 'COURIER') {
    this.selectedRole = role;
    this.registerForm.get('role')?.setValue(role);
  }

  get passwordStrength(): number {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
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