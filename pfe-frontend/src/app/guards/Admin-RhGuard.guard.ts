import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminRhGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
role_id=0;
  canActivate(): boolean {
    this.role_id=JSON.parse(localStorage.getItem('user')as string).role_id;
    if (this.role_id!=2) {
      return true;
    }
    // Redirect to login
    this.router.navigate(['/dashboard/profile']);
    return false;
  }
}