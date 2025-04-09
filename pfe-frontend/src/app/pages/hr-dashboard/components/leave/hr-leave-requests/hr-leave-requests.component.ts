import { Component, OnInit } from '@angular/core';
import { HrLeaveRequestService } from 'src/app/services/hr/leave-request.service';

@Component({
  selector: 'app-hr-leave-requests',
  template: `
    <div class="hr-leave-requests">
      <div class="page-header">
        <h2>Leave Requests</h2>
        <div class="filters">
          <select class="form-control" [(ngModel)]="statusFilter" (change)="filterRequests()">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div class="table-container text-black bg-white rounded shadow-sm">
        <table class="requests-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      <tr *ngFor="let request of filteredRequests">
        <td>{{ request.employee?.name || 'N/A' }}</td>
        <td>{{ request.leave_type?.name || 'N/A' }}</td>
        <td>{{ request.start_date | date }}</td>
        <td>{{ request.end_date | date }}</td>
        <td>{{ request.days }} days</td>
        <td>
          <span class="status-badge" [ngClass]="request.status">
            {{ request.status | titlecase }}
          </span>
        </td>
        <td class="actions">
          <ng-container *ngIf="request.status === 'pending'; else viewActions">
            <button class="btn-approve" (click)="updateStatus(request.id, 'approved')">Approve</button>
            <button class="btn-reject" (click)="updateStatus(request.id, 'rejected')">Reject</button>
          </ng-container>
          <ng-template #viewActions>
            <button class="btn-view" (click)="viewRequest(request.id)">View</button>
          </ng-template>
        </td>
      </tr>
    </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .hr-leave-requests {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .page-header h2 {
      margin: 0;
    }
    .filters {
      display: flex;
      gap: 10px;
    }
    .form-control {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .table-container {
      overflow-x: auto;
    }
    .requests-table {
      width: 100%;
      border-collapse: collapse;
    }
    .requests-table th, .requests-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .requests-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .requests-table tr:hover {
      background-color: #f5f5f5;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge.pending {
      background-color: #f1c40f;
      color: #fff;
    }
    .status-badge.approved {
      background-color: #2ecc71;
      color: #fff;
    }
    .status-badge.rejected {
      background-color: #e74c3c;
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn-approve, .btn-reject, .btn-view {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .btn-approve {
      background-color: #2ecc71;
      color: white;
    }
    .btn-approve:hover {
      background-color: #27ae60;
    }
    .btn-reject {
      background-color: #e74c3c;
      color: white;
    }
    .btn-reject:hover {
      background-color: #c0392b;
    }
    .btn-view {
      background-color: #3498db;
      color: white;
    }
    .btn-view:hover {
      background-color: #2980b9;
    }
  `]
})
export class HrLeaveRequestsComponent implements OnInit {
  statusFilter: string = 'all';
  allRequests: any[] = [];
  filteredRequests: any[] = [];

  constructor(private leaveService: HrLeaveRequestService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.leaveService.getAll().subscribe({
      next: (data) => {
        this.allRequests = data;
        this.filterRequests();
      },
      error: (err) => console.error('Error loading requests:', err)
    });
  }

  filterRequests(): void {
    if (this.statusFilter === 'all') {
      this.filteredRequests = [...this.allRequests];
    } else {
      this.filteredRequests = this.allRequests.filter(
        req => req.status === this.statusFilter
      );
    }
  }

  updateStatus(id: number, status: string): void {
    if (confirm(`Are you sure you want to ${status} this leave request?`)) {
      this.leaveService.updateStatus(id, status).subscribe({
        next: (updatedRequest) => {
          // Update local data
          const index = this.allRequests.findIndex(req => req.id === id);
          if (index > -1) {
            this.allRequests[index] = updatedRequest;
            this.filterRequests();
          }
        },
        error: (err) => console.error('Error updating status:', err)
      });
    }
  }

  viewRequest(id: number): void {
    // TODO: Implement view logic
    console.log('Viewing request:', id);
  }
}