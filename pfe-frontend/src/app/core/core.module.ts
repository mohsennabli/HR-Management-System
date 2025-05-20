import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from './sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    DashboardSidebarComponent,
    CardModule,
    ButtonModule,
    TooltipModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    DashboardSidebarComponent
  ]
})
export class CoreModule { }