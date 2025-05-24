import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreModule } from '../core.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    BreadcrumbModule,
    DashboardRoutingModule,
    DashboardComponent
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { } 