import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardSidebarComponent } from 'src/app/core/sidebar/sidebar.component';
import { AdminDashboardRoutingModule } from 'src/app/core/dashboards/admin/admin-dashboard-routing.module';
import { CoreModule } from 'src/app/core/core.module';
@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminDashboardRoutingModule,
    // Shared components
    // DashboardSidebarComponent is already part of CoreModule
    CoreModule
],
  exports: [AdminDashboardComponent]
})
export class AdminDashboardModule { }