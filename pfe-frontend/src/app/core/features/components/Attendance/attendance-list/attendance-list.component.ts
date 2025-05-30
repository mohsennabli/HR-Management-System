// src/app/features/attendance/attendance-list/attendance-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AttendanceService, UpdateAttendanceResponse } from 'src/app/core/features/components/Attendance/attendance.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    TableModule,
    BadgeModule,
    InputTextModule
  ]
})
export class AttendanceListComponent implements OnInit {
  attendances: any[] = [];
  isLoading = false;
  errorMessage = '';
  selectedDate = new Date().toISOString().substring(0, 10);
  selectedUserId = '';
  
  // Edit dialog properties
  showEditDialog = false;
  selectedAttendance: any = null;
  selectedAttendanceType: number | null = null;
  attendanceTypes = [
    { label: 'Entry', value: 0 },
    { label: 'Exit', value: 1 },
  ];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.attendanceService.synchroniseAttendance().subscribe(() => {
      this.loadAttendances();
    });
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

  getTypeLabel(type: string): string {
    switch (type) {
      case '0': return 'Entry';
      case '1': return 'Exit';
      case '2': return 'Break';
      default: return 'Unknown';
    }
  }

  openEditDialog(attendance: any): void {
    this.selectedAttendance = attendance;
    this.selectedAttendanceType = parseInt(attendance.type);
    this.showEditDialog = true;
  }

  saveAttendanceType(): void {
    if (!this.selectedAttendance || this.selectedAttendanceType === null) {
      return;
    }

    this.isLoading = true;
    this.attendanceService.updateAttendanceType(
      this.selectedAttendance.uid,
      this.selectedAttendanceType
    ).subscribe({
      next: (res: UpdateAttendanceResponse) => {
        if (res.success && this.selectedAttendanceType !== null) {
          // Update the local attendance record
          const index = this.attendances.findIndex(a => a.uid === this.selectedAttendance?.uid);
          if (index !== -1 && this.selectedAttendanceType !== null) {
            this.attendances[index].type = this.selectedAttendanceType.toString();
          }
          this.showEditDialog = false;
          this.selectedAttendance = null;
          this.selectedAttendanceType = null;
        } else {
          this.errorMessage = res.message || 'Error updating attendance type.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Server connection error: ' + (error.message || 'Unknown error');
        this.isLoading = false;
      }
    });
  }
}
