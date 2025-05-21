import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    AttendanceListComponent,
    WorkingHoursComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    BadgeModule,
    InputTextModule,
    AttendanceRoutingModule
  ],
  providers: [DatePipe]
})
export class AttendanceModule { }