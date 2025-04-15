import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HrDashboardComponent } from './hr-dashboard.component';
import { DashboardSidebarComponent} from 'src/app/core/sidebar/sidebar.component';
import { HrDashboardRoutingModule } from 'src/app/core/dashboards/hr/hr-dashboard-routing.module';
import { CoreModule } from 'src/app/core/core.module';
@NgModule({
  declarations: [
    HrDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HrDashboardRoutingModule,
    CoreModule
],
  exports: [HrDashboardComponent]
})
export class HrDashboardModule { }