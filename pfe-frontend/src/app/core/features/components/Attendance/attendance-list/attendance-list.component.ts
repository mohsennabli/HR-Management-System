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
  selectedUserId = JSON.parse(localStorage.getItem('user') as string)?.employee_id || '';
  role_id = JSON.parse(localStorage.getItem('user') as string)?.role_id || 0;
  
  // Edit dialog properties
  showEditDialog = false;
  selectedAttendance: any = null;
  selectedAttendanceType: number | null = null;
  attendanceTypes = [
    { label: 'Entry', value: 0 },
    { label: 'Exit', value: 1 },
    { label: 'Break', value: 2 }
  ];

  // Role-based access control
  isAdmin = false;
  isManager = false;
  isEmployee = false;

  constructor(private attendanceService: AttendanceService) {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user data found in localStorage');
        this.role_id = 0;
        this.selectedUserId = '';
      } else {
        const user = JSON.parse(userStr);
        this.role_id = user?.role_id || 0;
        this.selectedUserId = user?.employee_id || '';
        
        console.log('User data loaded:', {
          user,
          role_id: this.role_id,
          employee_id: this.selectedUserId
        });
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      this.role_id = 0;
      this.selectedUserId = '';
    }

    this.isAdmin = this.role_id === 1;      
    this.isManager = this.role_id === 3;    
    this.isEmployee = this.role_id === 2;   

    if (this.role_id === 0) {
      console.error('Invalid role_id detected:', this.role_id);
    }

    console.log('User Role Configuration:', {
      role_id: this.role_id,
      isAdmin: this.isAdmin,
      isManager: this.isManager,
      isEmployee: this.isEmployee,
      employee_id: this.selectedUserId,
      userData: localStorage.getItem('user')
    });
  }

  ngOnInit(): void {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.role_id || !user.employee_id) {
        console.error('Invalid user data in ngOnInit:', user);
        this.errorMessage = 'Invalid user data. Please log in again.';
        return;
      }

      if (this.isEmployee || this.isManager) {
        this.selectedUserId = user.employee_id;
        console.log('Setting user ID for employee/manager:', {
          userId: this.selectedUserId,
          role: this.isEmployee ? 'Employee' : 'Manager',
          role_id: this.role_id
        });
      }
    } catch (error) {
      console.error('Error verifying user data in ngOnInit:', error);
      this.errorMessage = 'Error loading user data. Please log in again.';
      return;
    }
    
    // Handle synchronisation
    this.isLoading = true;
    this.attendanceService.synchroniseAttendance().subscribe({
      next: () => {
        this.loadAttendances();
      },
      error: (error: Error) => {
        this.errorMessage = 'Error synchronizing attendance: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  loadAttendances(): void {
    if (!this.selectedUserId && (this.isEmployee || this.isManager)) {
      console.error('No user ID available for employee/manager');
      this.errorMessage = 'Unable to load attendance: Invalid user data';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userId = (this.isEmployee || this.isManager) ? 
      JSON.parse(localStorage.getItem('user') || '{}')?.employee_id : 
      this.selectedUserId;

    console.log('Loading attendances for user:', {
      userId,
      isEmployee: this.isEmployee,
      isManager: this.isManager,
      isAdmin: this.isAdmin,
      role_id: this.role_id,
      userData: localStorage.getItem('user')
    });

    this.attendanceService.getTodayAttendances(this.selectedDate, userId)
      .subscribe({
        next: res => {
          if (res.success) {
            // Filter records based on role
            if (this.isEmployee || this.isManager) {
              // Employees and managers can only see their own records
              this.attendances = res.logOfToday.filter((att: any) => 
                att.id === userId
              );
              console.log('Filtered attendances for employee/manager:', {
                totalRecords: res.logOfToday.length,
                filteredRecords: this.attendances.length,
                userId: userId
              });
            } else {
              // Admins can see all records
              this.attendances = res.logOfToday;
              console.log('Showing all records for admin:', {
                totalRecords: this.attendances.length
              });
            }
          } else {
            this.errorMessage = 'Error loading attendance.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Server connection error: ' + (error.message || 'Unknown error');
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
    // Only allow editing if user is admin or if it's their own record
    if (this.isAdmin || (attendance.id === this.selectedUserId)) {
      this.selectedAttendance = attendance;
      this.selectedAttendanceType = parseInt(attendance.type);
      this.showEditDialog = true;
    } else {
      this.errorMessage = 'You do not have permission to edit this record.';
    }
  }

  saveAttendanceType(): void {
    if (!this.selectedAttendance || this.selectedAttendanceType === null) {
      return;
    }

    if (!this.isAdmin && this.selectedAttendance.id !== this.selectedUserId) {
      this.errorMessage = 'You do not have permission to edit this record.';
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

  canEditRecord(attendance: any): boolean {
    return this.isAdmin || attendance.id === this.selectedUserId;
  }
}
