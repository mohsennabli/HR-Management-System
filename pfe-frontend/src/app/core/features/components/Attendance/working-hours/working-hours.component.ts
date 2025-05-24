// src/app/features/attendance/working-hours/working-hours.component.ts
import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/core/features/components/Attendance/attendance.service';
import { WorkHours } from 'src/app/models/workhours.model';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
})
export class WorkingHoursComponent implements OnInit {
  workHours: WorkHours[] = [];
  isLoading = false;
  selectedDate = new Date().toISOString().substring(0, 10);
  private profile = JSON.parse(localStorage.getItem('profile') as string);
  userId = this.profile?.id_employe;
  isEmployee = this.profile?.role_id === 4;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.attendanceService.synchroniseAttendance().subscribe(() => {this.isLoading = true;
    this.attendanceService
      .getWorkHours(this.selectedDate, this.isEmployee ? this.userId : undefined)
      .subscribe({
        next: res => {
          if (res.success && res.logOfToday.length) {
            // res.logOfToday[0] is the array of WorkHours rows
            this.workHours = res.logOfToday[0];
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });})
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
