import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from 'src/app/core/features/components/leave/leave-request.service';
import { EmployeeService } from '../../employee/employee.service';
import { AuthService } from 'src/app/services/auth.service';

interface LeaveRequest {
  id: number;
  employee_id: number;
  employeeName: string;
  leave_type_id: number;
  startDate: string;
  endDate: string;
  days: number;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss']
})
export class LeaveRequestsComponent implements OnInit {
  filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  activeFilter = 'all';
  loading = true;
  requests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  error: any;
  currentUserRole: number = 0;
  currentEmployeeId: number = 0;

  constructor(
    private leaveRequestService: LeaveRequestService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.fetchLeaveRequests();
  }

  private loadUserInfo(): void {
    const profile = localStorage.getItem('profile');
    if (profile) {
      const userData = JSON.parse(profile);
      this.currentUserRole = userData.role_id || 0;
      this.currentEmployeeId = userData.employee_id || 0;
    }
  }

  isAdmin(): boolean {
    return this.currentUserRole === 1;
  }

  isHR(): boolean {
    return this.currentUserRole === 2;
  }

  isEmployee(): boolean {
    return this.currentUserRole === 3;
  }

  canViewAllRequests(): boolean {
    return this.isAdmin() || this.isHR();
  }

  canDeleteRequest(request: LeaveRequest): boolean {
    if (this.isAdmin() || this.isHR()) {
      return true;
    }
    return this.isEmployee() && request.employee_id === this.currentEmployeeId && request.status === 'pending';
  }

  canApproveRequest(): boolean {
    return this.isAdmin() || this.isHR();
  }

  fetchLeaveRequests(): void {
    this.loading = true;
    this.error = null;
    
    this.leaveRequestService.getAll().subscribe({
      next: (response) => {
        if (!response || !Array.isArray(response)) {
          this.requests = [];
          this.filterRequests();
          this.loading = false;
          return;
        }

        if (response.length === 0) {
          this.requests = [];
          this.filteredRequests = [];
          this.loading = false;
          return;
        }

        this.requests = response.map((request: any) => {
          return {
            id: request.id,
            employee_id: request.employee_id,
            employeeName: request.employee?.first_name && request.employee?.last_name 
              ? `${request.employee.first_name} ${request.employee.last_name}` 
              : 'Unknown Employee',
            leave_type_id: request.leave_type_id,
            startDate: request.start_date,
            endDate: request.end_date,
            days: request.days,
            type: request.leave_type?.name || 'Unknown Type',
            status: request.status,
            reason: request.reason
          };
        });

        // Filter requests based on user role
        if (!this.canViewAllRequests()) {
          this.requests = this.requests.filter(request => request.employee_id === this.currentEmployeeId);
        }

        this.filterRequests();
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  filterRequests(): void {
    if (this.activeFilter === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(request =>
        request.status.toLowerCase() === this.activeFilter
      );
    }
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterRequests();
  }

  updateStatus(id: number, status: 'approved' | 'rejected'): void {
    if (!this.canApproveRequest()) {
      return;
    }

    this.leaveRequestService.updateStatus(id, status).subscribe({
      next: () => {
        this.fetchLeaveRequests();
      },
      error: (error) => {
        console.error('Error updating leave request status:', error);
      }
    });
  }

  deleteRequest(id: number): void {
    const request = this.requests.find(r => r.id === id);
    if (!request || !this.canDeleteRequest(request)) {
      return;
    }

    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leaveRequestService.delete(id).subscribe({
        next: () => {
          this.fetchLeaveRequests();
        },
        error: (error) => {
          console.error('Error deleting leave request:', error);
        }
      });
    }
  }
}
