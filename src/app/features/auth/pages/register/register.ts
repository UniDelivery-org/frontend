import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertCircle, ArrowRight, Car, CircleAlert, Lock, LucideAngularModule, Mail, Package, Phone, User } from 'lucide-angular';
import { passwordMatchValidator } from '../../../../core/validators/passwordMatch.validator';
import { RegisterDto } from '../../data-access/register.dto';
import { UserRole } from '../../../shared/enums/user.enums';
import { Observable } from 'rxjs';
import { ApiError } from '../../../../shared/models/api.error.model';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../../store/auth.reducer';
import { authActions } from '../../store/auth.actions';

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
  private store = inject(Store)

  registerForm: FormGroup;
  selectedRole: UserRole = UserRole.SENDER;
  isLoading$: Observable<boolean>;
  error$: Observable<ApiError | null>;
  UserRole = UserRole;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.nonNullable.group({
        role: [this.selectedRole, Validators.required],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      }, { validators: passwordMatchValidator }
    );
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  setRole(role: UserRole) {
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
      const formData = this.registerForm.getRawValue();
      const registerDto: RegisterDto = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      }
      console.log('Registering as:', registerDto);
      this.store.dispatch(authActions.register({ registerDto }))
    }
  }
}