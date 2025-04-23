import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from 'src/app/core/sidebar/sidebar.component';

@NgModule({
  declarations: [
    DashboardSidebarComponent,
  
    
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DashboardSidebarComponent
  ]
})
export class CoreModule { }