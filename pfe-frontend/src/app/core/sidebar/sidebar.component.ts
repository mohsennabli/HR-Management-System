import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
})
export class DashboardSidebarComponent implements OnInit {
  user: any = null;
role_id:number=0;
employe_id:number=0;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.role_id=localStorage.getItem('profile')?JSON.parse(localStorage.getItem('profile')!).role_id:0;
    this.employe_id=localStorage.getItem('profile')?JSON.parse(localStorage.getItem('profile')!).employee_id
:0;
    this.auth.me().subscribe({
      next: user => this.user = user,
      error: () => this.user = null
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}