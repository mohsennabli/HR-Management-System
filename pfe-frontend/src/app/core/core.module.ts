import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from 'src/app/core/sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
  declarations: [
    DashboardSidebarComponent,
  
    
  ],
  imports: [
    CommonModule,
    RouterModule,
     CardModule,
    ButtonModule,
    TooltipModule
  ],
  exports: [
    DashboardSidebarComponent
  ]
})
export class CoreModule { }