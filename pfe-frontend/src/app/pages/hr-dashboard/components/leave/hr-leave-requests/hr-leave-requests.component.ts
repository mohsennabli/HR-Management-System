import { Component, OnInit } from '@angular/core';

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
      
      <div class="table-container">
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
            <!-- Sample data - replace with actual data from service -->
            <tr>
              <td>John Doe</td>
              <td>Annual Leave</td>
              <td>2024-03-15</td>
              <td>2024-03-20</td>
              <td>6 days</td>
              <td><span class="status-badge pending">Pending</span></td>
              <td class="actions">
                <button class="btn-approve" (click)="approveRequest(1)">Approve</button>
                <button class="btn-reject" (click)="rejectRequest(1)">Reject</button>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Sick Leave</td>
              <td>2024-03-10</td>
              <td>2024-03-12</td>
              <td>3 days</td>
              <td><span class="status-badge approved">Approved</span></td>
              <td class="actions">
                <button class="btn-view" (click)="viewRequest(2)">View</button>
              </td>
            </tr>
            <tr>
              <td>Mike Johnson</td>
              <td>Personal Leave</td>
              <td>2024-03-18</td>
              <td>2024-03-19</td>
              <td>2 days</td>
              <td><span class="status-badge rejected">Rejected</span></td>
              <td class="actions">
                <button class="btn-view" (click)="viewRequest(3)">View</button>
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

  constructor() { }

  ngOnInit(): void {
    // Initialize component - load leave requests from service
  }

  filterRequests(): void {
    // TODO: Implement filtering logic
    console.log('Filtering by status:', this.statusFilter);
  }

  approveRequest(id: number): void {
    // TODO: Implement approve logic
    console.log('Approving request:', id);
  }

  rejectRequest(id: number): void {
    // TODO: Implement reject logic
    console.log('Rejecting request:', id);
  }

  viewRequest(id: number): void {
    // TODO: Implement view logic
    console.log('Viewing request:', id);
  }
} 