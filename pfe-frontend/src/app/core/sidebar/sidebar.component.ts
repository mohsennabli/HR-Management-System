import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-sidebar',
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>{{ getDashboardTitle(dashboardType) }} Dashboard</h2>
      </div>
      <nav class="sidebar-nav">
        <!-- Admin Links -->
        <div *ngIf="dashboardType === 'admin'">
          <div class="nav-section">
            <h3>Administration</h3>
            <ul>
              <li><a routerLink="/admin/users" routerLinkActive="active">Manage Users</a></li>
              <li><a routerLink="/admin/employees" routerLinkActive="active">Manage Employees</a></li>

            </ul>
          </div>
        </div>

        <!-- HR Links -->
        <div *ngIf="dashboardType === 'hr'">
          <div class="nav-section">
            <h3>Employee Management</h3>
            <ul>
              <li><a routerLink="/hr/employee" routerLinkActive="active">Employee List</a></li>
              <li><a routerLink="/hr/employee/create" routerLinkActive="active">Add Employee</a></li>
            </ul>
          </div>

          <div class="nav-section">
            <h3>Leave Management</h3>
            <ul>
              <li><a routerLink="/hr/leave" routerLinkActive="active">Leave Types</a></li>
              <li><a routerLink="/hr/leave/create" routerLinkActive="active">Add Leave Type</a></li>
              <li><a routerLink="/hr/leave/requests" routerLinkActive="active">Leave Requests</a></li>
            </ul>
          </div>

          <div class="nav-section">
            <h3>Training Management</h3>
            <ul>
              <li><a routerLink="/hr/training" routerLinkActive="active">Training Programs</a></li>
              <li><a routerLink="/hr/training/create" routerLinkActive="active">Add Training</a></li>
            </ul>
          </div>

          <div class="nav-section">
            <h3>Discipline Management</h3>
            <ul>
              <li><a routerLink="/hr/discipline" routerLinkActive="active">Disciplinary Actions</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class DashboardSidebarComponent {
  @Input() dashboardType: 'admin' | 'hr' | 'employee' = 'admin';

  getDashboardTitle(type: 'admin' | 'hr' | 'employee'): string {
    const titles: { [key: string]: string } = {
      admin: 'Admin',
      hr: 'HR',
      employee: 'Employee'
    };
    return titles[type] || 'Unknown';
  }
}