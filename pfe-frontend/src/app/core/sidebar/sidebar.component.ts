import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
})
export class DashboardSidebarComponent implements OnInit {
  @Input() collapsed: boolean | undefined;
  @Output() toggleSidebar = new EventEmitter<void>();
  user: any = null;
  role_id: number = 0;
  employe_id: number = 0;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: user => {
        this.user = user;
        this.role_id = user.role_id;
        this.employe_id = user.employee_id;
        console.log('User role:', this.role_id); // Debug log
      },
      error: () => {
        this.user = null;
        this.role_id = 0;
        this.employe_id = 0;
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  isAdmin(): boolean {
    return this.role_id === 1; // Admin role ID is 1
  }

  isHR(): boolean {
    return this.role_id === 3; // HR role ID is 3
  }

  isEmployee(): boolean {
    return this.role_id === 2; // Employee role ID is 2
  }

  canAccess(requiredRoles: number[]): boolean {
    console.log('Checking access for roles:', requiredRoles, 'Current role:', this.role_id); // Debug log
    return requiredRoles.includes(this.role_id);
  }
}