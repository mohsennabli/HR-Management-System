import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { LeaveType } from 'src/app/models/leave-type.model';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
navigateToEdit(arg0: number) {
throw new Error('Method not implemented.');
}
sort(arg0: any) {
throw new Error('Method not implemented.');
}
  leaveTypes: LeaveType[] = [];
  loading = false;
  error = '';
  successMessage = '';
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Leave Type' },
    { key: 'description', label: 'Description' },
    { key: 'daysAllowed', label: 'Days Allowed' },
    { key: 'isPaid', label: 'Paid' },
    { key: 'actions', label: 'Actions' }
  ];
cols: any;
currentSortField: any;
sortAsc: any;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.leaveTypeService.getAll().subscribe({
      next: (response) => {
        this.leaveTypes = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load leave types';
        this.loading = false;
      }
    });
  }

  confirmDelete(leaveType: LeaveType): void {
    if (confirm(`Are you sure you want to delete "${leaveType.name}"?`)) {
      this.deleteLeaveType(leaveType.id);
    }
  }

  private deleteLeaveType(id: number): void {
    this.leaveTypeService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Leave type deleted successfully';
        this.loadLeaveTypes();
      },
      error: (error) => {
        this.error = 'Failed to delete leave type';
      }
    });
  }

  getPaidStatus(isPaid: boolean): string {
    return isPaid ? 'Yes' : 'No';
  }

  editLeaveType(id: number): void {
    this.router.navigate(['/leave/edit', id]);
  }
}