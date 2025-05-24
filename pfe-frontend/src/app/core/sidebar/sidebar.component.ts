import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ButtonModule,
    RippleModule
  ]
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
    return this.role_id === 1;
  }

  isHR(): boolean {
    return this.role_id === 3;
  }

  isEmployee(): boolean {
    return this.role_id === 2;
  }

  canAccess(requiredRoles: number[]): boolean {
    return requiredRoles.includes(this.role_id);
  }
}