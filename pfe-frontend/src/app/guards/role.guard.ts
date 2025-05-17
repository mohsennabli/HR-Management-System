import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authService.getUserRole();

    if (!this.authService.isLoggedIn()) {
      // User not logged in, redirect to login
      return this.router.parseUrl('/login');
    }

    if (userRole && userRole === expectedRole) {
      // Authorized
      return true;
    } else {
      // Unauthorized, redirect to unauthorized page
      return this.router.parseUrl('/unauthorized');
    }
  }
}
