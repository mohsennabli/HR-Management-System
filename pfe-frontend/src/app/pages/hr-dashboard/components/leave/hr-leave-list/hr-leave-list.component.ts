import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HrLeaveTypeService, LeaveType } from '../../../services/hr-leave-type.service';

@Component({
  selector: 'app-hr-leave-list',
  template: `
    <div class="hr-leave-list">
      <div class="page-header">
        <h2>Leave Types</h2>
        <button class="btn-primary" routerLink="type/create">Add New Leave Type</button>
      </div>
      
      <div *ngIf="loading" class="loading">Loading leave types...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div class="table-container" *ngIf="!loading && !error">
        <table class="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Leave Type</th>
              <th>Description</th>
              <th>Days Allowed</th>
              <th>Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let leaveType of leaveTypes">
              <td>{{ leaveType.id }}</td>
              <td>{{ leaveType.name }}</td>
              <td>{{ leaveType.description }}</td>
              <td>{{ leaveType.days_allowed }}</td>
              <td>{{ leaveType.is_paid ? 'Yes' : 'No' }}</td>
              <td class="actions">
                <button class="btn-edit" [routerLink]="['edit', leaveType.id]">Edit</button>
                <button class="btn-delete" (click)="onDelete(leaveType.id!)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="leaveTypes.length === 0">
              <td colspan="6" class="no-data">No leave types found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .hr-leave-list {
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
    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary:hover {
      background-color: #2980b9;
    }
    .table-container {
      overflow-x: auto;
    }
    .leave-table {
      width: 100%;
      border-collapse: collapse;
    }
    .leave-table th, .leave-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .leave-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .leave-table tr:hover {
      background-color: #f5f5f5;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
    .btn-edit, .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-edit {
      background-color: #2ecc71;
      color: white;
    }
    .btn-edit:hover {
      background-color: #27ae60;
    }
    .btn-delete {
      background-color: #e74c3c;
      color: white;
    }
    .btn-delete:hover {
      background-color: #c0392b;
    }
    .loading, .error, .no-data {
      text-align: center;
      padding: 20px;
    }
    .error {
      color: #e74c3c;
    }
    .no-data {
      color: #7f8c8d;
    }
  `]
})
export class HrLeaveListComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  loading = false;
  error = '';

  constructor(
    private leaveTypeService: HrLeaveTypeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.loading = true;
    this.error = '';
    
    this.leaveTypeService.getLeaveTypes().subscribe({
      next: (response) => {
        this.leaveTypes = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load leave types';
        this.loading = false;
        console.error('Error loading leave types:', error);
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this leave type?')) {
      this.leaveTypeService.deleteLeaveType(id).subscribe({
        next: () => {
          this.loadLeaveTypes();
        },
        error: (error) => {
          this.error = 'Failed to delete leave type';
          console.error('Error deleting leave type:', error);
        }
      });
    }
  }
} 