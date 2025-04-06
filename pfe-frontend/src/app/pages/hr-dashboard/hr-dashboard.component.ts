import { Component } from '@angular/core';

@Component({
  selector: 'app-hr-dashboard',
  template: `
    <div class="hr-dashboard">
      <app-hr-sidebar class="sidebar"></app-hr-sidebar>
      <div class="content">
        <div class="dashboard-container">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hr-dashboard {
      display: flex;
      min-height: 100vh;
      background: transparent;
    }
    .sidebar {
      width: 280px;
      background: rgba(13, 27, 42, 0.95);
      color: #e8eaf6;
      padding: 20px;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }
    .content {
      flex: 1;
      margin-left: 280px;
      background: transparent;
    }
    .dashboard-container {
      padding: 20px;
      min-height: 100vh;
    }
  `]
})
export class HrDashboardComponent {
  constructor() { }
} 