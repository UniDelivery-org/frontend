import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-angular';
import { LoginDto } from '../../data-access/login.dto';
import { Observable } from 'rxjs';
import { ApiError } from '../../../../shared/models/api.error.model';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../../store/auth.reducer';
import { authActions } from '../../store/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
  readonly ArrowRight = ArrowRight;
  readonly AlertCircle = AlertCircle;

  private store = inject(Store)

  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  error$: Observable<ApiError | null>;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginDto: LoginDto = this.loginForm.getRawValue();
      console.log(loginDto);
      this.store.dispatch(authActions.login({loginDto}))
    }
  }
}
