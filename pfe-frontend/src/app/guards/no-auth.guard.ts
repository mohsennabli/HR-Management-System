import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // If user is authenticated, redirect to dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }
    // If user is not authenticated, allow access to login
    return true;
  }
} 