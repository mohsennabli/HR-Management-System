// src/app/features/attendance/working-hours/working-hours.component.ts
import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/core/features/components/Attendance/attendance.service';
import { WorkHours } from 'src/app/models/workhours.model';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, TableModule]
})
export class WorkingHoursComponent implements OnInit {
  workHours: WorkHours[] = [];
  isLoading = false;
  selectedDate = new Date();
  weekRange = '';
  private profile = JSON.parse(localStorage.getItem('profile') as string);
  userId = this.profile?.id_employe;
  isEmployee = this.profile?.role_id === 4;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    console.log('Initial date:', this.selectedDate.toISOString());
    this.updateWeekRange();
    this.loadWorkHours();
  }

  onDateChange(event: any): void {
    console.log('Date changed via onChange:', event);
    // The selectedDate is already updated via ngModel
    this.updateWeekRange();
    this.loadWorkHours();
  }

  onDateSelect(): void {
    console.log('Date selected via onSelect:', this.selectedDate.toISOString());
    // The selectedDate is already updated via ngModel
    this.updateWeekRange();
    this.loadWorkHours();
  }

  private updateWeekRange(): void {
    const startOfWeek = new Date(this.selectedDate);
    startOfWeek.setDate(this.selectedDate.getDate() - this.selectedDate.getDay() + 1);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    this.weekRange = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    console.log('Week range:', this.weekRange);
    console.log('Start of week:', startOfWeek.toISOString());
    console.log('End of week:', endOfWeek.toISOString());
  }

  private loadWorkHours(): void {
    this.isLoading = true;
    const dateStr = this.selectedDate.toISOString().substring(0, 10);
    console.log('Loading work hours for date:', dateStr);
    
    this.attendanceService.synchroniseAttendance().subscribe({
      next: () => {
        console.log('Attendance synchronized, fetching work hours...');
        this.attendanceService
          .getWorkHours(dateStr, this.isEmployee ? this.userId : undefined)
          .subscribe({
            next: res => {
              console.log('Work hours response:', res);
              if (res.success && res.logOfToday.length) {
                this.workHours = res.logOfToday[0];
                console.log('Processed work hours:', this.workHours);
              } else {
                console.log('No work hours data received');
              }
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error fetching work hours:', error);
              this.isLoading = false;
            }
          });
      },
      error: (error) => {
        console.error('Error synchronizing attendance:', error);
        this.isLoading = false;
      }
    });
  }

  getTotal(row: WorkHours): string {
    const days = [
      'MonHours',
      'TueHours',
      'WedHours',
      'ThuHours',
      'FriHours',
      'SatHours',
      'SunHours'
    ] as const;
    const total = days.reduce((sum, day) => sum + (row[day]?.hours || 0), 0);
    return total.toFixed(2) + 'h';
  }
}
