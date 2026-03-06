import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPasswordControl = control.get('confirmPassword');
    const confirmPassword = confirmPasswordControl?.value;

    if (password !== confirmPassword) {
        confirmPasswordControl?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
    } else {
        const errors = confirmPasswordControl?.errors;
        if (errors) {
            delete errors['passwordMismatch'];
            confirmPasswordControl?.setErrors(Object.keys(errors).length ? errors : null);
        }
        return null;
    }
};
