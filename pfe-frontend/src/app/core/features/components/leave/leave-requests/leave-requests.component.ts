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

  constructor(
    private leaveRequestService: LeaveRequestService,
    private employeeService: EmployeeService // Inject EmployeeService
  ) {}

  ngOnInit(): void {
    this.fetchLeaveRequests();
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

      // If response is empty, set empty arrays and return
      if (response.length === 0) {
        this.requests = [];
        this.filteredRequests = [];
        this.loading = false;
        return;
      }

      const requestsWithEmployeeNames = response.map((request: any) => {
        return this.employeeService.getById(request.employee_id).toPromise()
          .then((employee: any) => {
            // Handle both wrapped and unwrapped employee responses
            const employeeData = employee?.data || employee;
            
            return {
              id: request.id,
              employee_id: request.employee_id,
              employeeName: employeeData?.first_name && employeeData?.last_name 
                ? `${employeeData.first_name} ${employeeData.last_name}` 
                : 'Unknown Employee',
              leave_type_id: request.leave_type_id,
              startDate: request.start_date,
              endDate: request.end_date,
              days: request.days,
              type: request.leave_type?.name || 'Unknown Type',
              status: request.status,
              reason: request.reason
            };
          })
          .catch(() => {
            // Return request with default employee name if employee fetch fails
            return {
              ...request,
              employeeName: 'Unknown Employee',
              startDate: request.start_date,
              endDate: request.end_date,
              type: request.leave_type?.name || 'Unknown Type'
            };
          });
      });

      Promise.all(requestsWithEmployeeNames).then((resolvedRequests) => {
        this.requests = resolvedRequests;
        this.filterRequests();
        this.loading = false;
      });
    },
    error: (error) => {
      console.error('Error fetching leave requests:', error);
      this.error = error;
      this.requests = [];
      this.filteredRequests = [];
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
    this.fetchLeaveRequests(); // Refresh the data
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
