import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/core/features/components/Attendance/attendance.service';
import { WorkHours } from 'src/app/models/workhours.model';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, TableModule, InputTextModule]
})
export class WorkingHoursComponent implements OnInit {
  workHours: WorkHours[] = [];
  isLoading = false;
  errorMessage = '';
  selectedDate = new Date();
  weekRange = '';
  selectedUserId = '';
  role_id = 0;
  
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
      employee_id: this.selectedUserId
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

    this.updateWeekRange();
    this.loadWorkHours();
  }

  onDateChange(): void {
    console.log('Date changed:', this.selectedDate.toISOString());
    this.updateWeekRange();
    this.loadWorkHours();
  }

  onDateSelect(): void {
    console.log('Date selected:', this.selectedDate.toISOString());
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
  }

  public async loadWorkHours(): Promise<void> {
    if (!this.selectedUserId && (this.isEmployee || this.isManager)) {
      console.error('No user ID available for employee/manager');
      this.errorMessage = 'Unable to load working hours: Invalid user data';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userId = (this.isEmployee || this.isManager) ? 
      JSON.parse(localStorage.getItem('user') || '{}')?.employee_id : 
      this.selectedUserId;

    console.log('Loading work hours for user:', {
      userId,
      isEmployee: this.isEmployee,
      isManager: this.isManager,
      isAdmin: this.isAdmin,
      role_id: this.role_id
    });

    try {
      await this.attendanceService.synchroniseAttendance();
      console.log('Attendance synchronized, fetching work hours...');
      
      this.attendanceService.getWorkHours(this.selectedDate.toISOString().substring(0, 10), userId)
        .subscribe({
          next: res => {
            console.log('Work hours response:', res);
            if (res.success && res.logOfToday.length) {
              // Filter records based on role
              if (this.isEmployee || this.isManager) {
                // Employees and managers can only see their own records
                this.workHours = res.logOfToday[0].filter((record: any) => 
                  record.id === userId
                );
                console.log('Filtered work hours for employee/manager:', {
                  totalRecords: res.logOfToday[0].length,
                  filteredRecords: this.workHours.length,
                  userId: userId
                });
              } else {
                // Admins can see all records
                this.workHours = res.logOfToday[0];
                console.log('Showing all records for admin:', {
                  totalRecords: this.workHours.length
                });
              }
            } else {
              console.log('No work hours data received');
              this.workHours = [];
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching work hours:', error);
            this.errorMessage = 'Server connection error: ' + (error.message || 'Unknown error');
            this.isLoading = false;
          }
        });
    } catch (error) {
      console.error('Error synchronizing attendance:', error);
      this.errorMessage = 'Error synchronizing attendance: ' + (error instanceof Error ? error.message : 'Unknown error');
      this.isLoading = false;
    }
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
