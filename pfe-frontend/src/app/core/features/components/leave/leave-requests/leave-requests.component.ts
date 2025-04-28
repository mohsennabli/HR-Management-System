import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from 'src/app/core/features/components/leave/leave-request.service';
import { EmployeeService } from '../../employee/employee.service';
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

  constructor(private leaveRequestService: LeaveRequestService) {}

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    this.loading = true;
    this.leaveRequestService.getAll().subscribe({
      next: (response) => {
        this.requests = response.map((request: any) => ({
          id: request.id,
          employee_id: request.employee_id,
          employeeName: request.employee?.name || 'Unknown Employee',
          leave_type_id: request.leave_type_id,
          startDate: request.start_date,
          endDate: request.end_date,
          days: request.days,
          type: request.leave_type?.name || 'Unknown Type',
          status: request.status,
          reason: request.reason
        }));
        this.filterRequests();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching leave requests:', error);
        this.loading = false;
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterRequests();
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

  openNewRequest(): void {
    // Refresh the data
    this.fetchLeaveRequests();
  }

  updateStatus(id: number, status: 'approved' | 'rejected'): void {
    this.leaveRequestService.updateStatus(id, status).subscribe({
      next: () => {
        this.fetchLeaveRequests(); // Refresh the list after status update
      },
      error: (error) => {
        console.error('Error updating leave request status:', error);
      }
    });
  }

  deleteRequest(id: number): void {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leaveRequestService.delete(id).subscribe({
        next: () => {
          this.fetchLeaveRequests(); // Refresh the list after deletion
        },
        error: (error) => {
          console.error('Error deleting leave request:', error);
        }
      });
    }
  }
}