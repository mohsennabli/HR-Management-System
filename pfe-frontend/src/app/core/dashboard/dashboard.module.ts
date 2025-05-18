import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from 'src/app/core/dashboard/dashboard-routing.module';
import { CoreModule } from '../core.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    CoreModule,
    BreadcrumbModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { } 