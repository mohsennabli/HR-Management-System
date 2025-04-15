import { Component } from '@angular/core';

@Component({
  selector: 'app-hr-dashboard',
  template: `
    <div class="dashboard-container">
      <app-dashboard-sidebar dashboardType="hr"></app-dashboard-sidebar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
      background: transparent;
    }
    
    .content {
      flex: 1;
      margin-left: 280px;
      padding: 20px;
      background: transparent;
    }
  `]
})
export class HrDashboardComponent {}