import { Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: { popup: 'uni-toast', title: 'uni-toast-title' },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private notification = signal<{ message: string, visible: boolean }>({ message: '', visible: false });

  getNotification() {
    return this.notification.asReadonly();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
      Toast.fire({
          icon: type,
          title: message,
          customClass: {
              popup: `uni-toast toast-${type}`
          }
      });
  }

  confirm(
    title: string,
    text: string,
    confirmButtonText: string = 'Oui, confirmer!',
    cancelButtonText: string = 'Annuler'
  ) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-uni-500)',
      cancelButtonColor: 'transparent',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      customClass: {
        popup: 'uni-popup',
        title: 'uni-title',
        htmlContainer: 'uni-text',
        confirmButton: 'uni-confirm-btn',
        cancelButton: 'uni-cancel-btn',
      },
    });
  }

  showError(title: string, text: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: 'var(--color-uni-500)',
      customClass: {
        popup: 'uni-popup',
        title: 'uni-title',
        htmlContainer: 'uni-text',
        confirmButton: 'uni-confirm-btn',
      },
    });
  }

  errorWithAction(title: string, text: string, confirmButtonText: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonColor: 'var(--color-uni-500)',
      cancelButtonColor: 'transparent',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'uni-popup',
        title: 'uni-title',
        htmlContainer: 'uni-text',
        confirmButton: 'uni-confirm-btn',
        cancelButton: 'uni-cancel-btn',
      },
    });
  }

  promptNumber(title: string, placeholder: string, confirmButtonText: string = 'Submit') {
      return Swal.fire({
        title: title,
        input: 'number',
        inputPlaceholder: placeholder,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        confirmButtonColor: 'var(--color-uni-500)',
        customClass: {
            popup: 'uni-popup',
            title: 'uni-title',
            htmlContainer: 'uni-text',
            confirmButton: 'uni-confirm-btn',
            cancelButton: 'uni-cancel-btn',
            input: 'uni-input'
        }
      });
  }
}
