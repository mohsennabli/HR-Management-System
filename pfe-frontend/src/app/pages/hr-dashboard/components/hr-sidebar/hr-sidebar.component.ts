import { Component } from '@angular/core';

@Component({
  selector: 'app-hr-sidebar',
  template: `
    <div class="hr-sidebar">
      <div class="sidebar-header">
        <h2>HR Dashboard</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <!-- Employee Management -->
          <li class="nav-section">
            <h3>Employee Management</h3>
            <ul>
              <li><a routerLink="employee" routerLinkActive="active">Employee List</a></li>
              <li><a routerLink="employee/create" routerLinkActive="active">Add Employee</a></li>
            </ul>
          </li>
          
          <!-- Leave Management -->
          <li class="nav-section">
            <h3>Leave Management</h3>
            <ul>
              <li><a routerLink="leave" routerLinkActive="active">Leave Types</a></li>
              <li><a routerLink="leave/create" routerLinkActive="active">Add Leave Type</a></li>
              <li><a routerLink="leave/requests" routerLinkActive="active">Leave Requests</a></li>
            </ul>
          </li>
          
          <!-- Training Management -->
          <li class="nav-section">
            <h3>Training Management</h3>
            <ul>
              <li><a routerLink="training" routerLinkActive="active">Training Programs</a></li>
              <li><a routerLink="training/create" routerLinkActive="active">Add Training</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .hr-sidebar {
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 20px;
    }
    .sidebar-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #e8eaf6;
      font-weight: 500;
    }
    .sidebar-nav {
      padding: 0 20px;
    }
    .nav-section {
      margin-bottom: 20px;
    }
    .nav-section h3 {
      padding: 0;
      font-size: 0.9rem;
      color: #9fa8da;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .nav-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .nav-section li {
      margin: 5px 0;
    }
    .nav-section a {
      display: block;
      padding: 12px 15px;
      color: #e8eaf6;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }
    .nav-section a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .nav-section a.active {
      background: linear-gradient(135deg, #1a237e, #283593);
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class HrSidebarComponent {} 