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
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    BadgeModule,
    InputTextModule,
    CalendarModule,
    AttendanceRoutingModule,
    WorkingHoursComponent,
    AttendanceListComponent,
    DialogModule
  ],
  providers: [DatePipe]
})
export class AttendanceModule { }