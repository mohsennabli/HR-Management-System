import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from 'src/app/core/features/components/leave/leave-request.service';
import { LeaveRequest } from 'src/app/models/leave-request.model';

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss']
})
export class LeaveRequestsComponent implements OnInit {
confirmDelete(_t24: any) {
throw new Error('Method not implemented.');
}
getPaidStatus(arg0: any) {
throw new Error('Method not implemented.');
}
  statusFilter: string = 'all';
  allRequests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  loading = false;
  error = '';
successMessage: any;
columns: any;
leaveTypes: any;

  constructor(
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';
    
    this.leaveRequestService.getAll().subscribe({
      next: (data) => {
        this.allRequests = data;
        this.filterRequests();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        this.error = 'Failed to load leave requests. Please try again.';
        this.loading = false;
      }
    });
  }

  filterRequests(): void {
    this.filteredRequests = this.statusFilter === 'all' 
      ? [...this.allRequests] 
      : this.allRequests.filter(req => req.status === this.statusFilter);
  }

  updateStatus(request: LeaveRequest, status: 'approved' | 'rejected'): void {
    if (confirm(`Are you sure you want to ${status} this leave request?`)) {
      this.leaveRequestService.updateStatus(request.id, status).subscribe({
        next: (updatedRequest) => {
          const index = this.allRequests.findIndex(req => req.id === request.id);
          if (index > -1) {
            this.allRequests[index] = updatedRequest;
            this.filterRequests();
          }
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.error = `Failed to ${status} request. Please try again.`;
        }
      });
    }
  }

  viewRequestDetails(request: LeaveRequest): void {
    // Implement modal or navigation to detailed view
    console.log('Viewing request details:', request);
  }

  getStatusClass(status: string): string {
    return {
      'pending': 'bg-warning',
      'approved': 'bg-success',
      'rejected': 'bg-danger'
    }[status.toLowerCase()] || 'bg-secondary';
  }
}