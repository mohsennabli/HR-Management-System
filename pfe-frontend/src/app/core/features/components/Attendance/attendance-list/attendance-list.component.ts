// src/app/features/attendance/attendance-list/attendance-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/core/features/components/Attendance/attendance.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
})
export class AttendanceListComponent implements OnInit {
  attendances: any[] = [];
  isLoading = false;
  errorMessage = '';
  selectedDate = new Date().toISOString().substring(0, 10);
  selectedUserId = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.attendanceService.synchroniseAttendance().subscribe(() => {
    this.loadAttendances();
  })
}

  loadAttendances(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.attendanceService.getTodayAttendances(this.selectedDate, this.selectedUserId)
      .subscribe({
        next: res => {
          if (res.success) {
            this.attendances = res.logOfToday;
          } else {
            this.errorMessage = 'Error loading attendance.';
          }
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Server connection error.';
          this.isLoading = false;
        }
      });
  }

  getTypeLabel(type: number): string {
    switch (type) {
      case 0: return 'Entry';
      case 1: return 'Exit';
      case 2: return 'Break';
      default: return 'Unknown';
    }
  }
}
