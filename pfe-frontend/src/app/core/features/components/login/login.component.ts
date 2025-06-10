import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

interface ResetPasswordResponse {
  message: string;
  email_status: {
    sent: boolean;
    email: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  isSubmitting = false;
  role_id=0;
  constructor(
    private auth: AuthService, 
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    this.isSubmitting = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful'
        });
        this.role_id=JSON.parse(localStorage.getItem('user')as string).role_id;
        this.router.navigate([this.role_id!=2?'/dashboard/employees':'/dashboard/profile']);
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMsg = err.error.message || 'Login failed';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMsg
        });
      }
    });
  }

  onForgotPassword() {
    if (!this.email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter your email address first'
      });
      return;
    }

    this.isSubmitting = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Sending',
      detail: 'Sending password reset email...'
    });
    
    this.auth.resetPassword(this.email).subscribe({
      next: (response: ResetPasswordResponse) => {
        this.isSubmitting = false;
        if (response.email_status.sent) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password reset email sent successfully'
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Password reset successful but email could not be sent'
          });
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Password reset failed'
        });
      }
    });
  }
}