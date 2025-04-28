import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-sidebar',
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Dashboard</h2>
      </div>

      <div class="nav-section">
          <h3>Statistics</h3>
          <ul>
            <li><a routerLink="/statistics" routerLinkActive="active">HR Analytics</a></li>
          </ul>
        </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3>User Management</h3>
          <ul>
            <li><a routerLink="/users" routerLinkActive="active">Manage Users</a></li>
            <li><a routerLink="/employees" routerLinkActive="active">Manage Employees</a></li>
          </ul>
        </div>

        <div class="nav-section">
          <h3>Access Control</h3>
          <ul>
            <li><a routerLink="/roles" routerLinkActive="active">Manage Roles</a></li>
            <li><a routerLink="/permissions" routerLinkActive="active">Manage Permissions</a></li>
          </ul>
        </div>

        <div class="nav-section">
          <h3>Leave Management</h3>
          <ul>
            <li><a routerLink="/leave" routerLinkActive="active">Leave Types</a></li>
            <li><a routerLink="/leave/requests" routerLinkActive="active">Leave Requests</a></li>
          </ul>
        </div>

        <div class="nav-section">
          <h3>Training Management</h3>
          <ul>
            <li><a routerLink="/training" routerLinkActive="active">Training Programs</a></li>
          </ul>
        </div>

        <div class="nav-section">
          <h3>Discipline Management</h3>
          <ul>
            <li><a routerLink="/discipline" routerLinkActive="active">Disciplinary Actions</a></li>
          </ul>
        </div>
      </nav>
    </div>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class DashboardSidebarComponent {}