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

sort(field: string) {
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
    { field: 'is_paid', header: 'Paid' }, // Changed to match API response
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
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Leave Type' },
      { field: 'description', header: 'Description' },
      { field: 'days_allowed', header: 'Days Allowed' }, // Changed to match API response
      { field: 'is_paid', header: 'Paid' }, // Changed to match API response
      { field: 'actions', header: 'Actions' }
    ];
    this.loadLeaveTypes();
  }
  

  loadLeaveTypes(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.leaveTypeService.getAll().subscribe({
      next: (response) => {
        // Map API response to match our model if needed
        this.leaveTypes = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          days_allowed: item.days_allowed, // Using snake_case to match API
          is_paid: item.is_paid, // Using snake_case to match API
          carry_over: item.carry_over,
          max_carry_over: item.max_carry_over
        }));
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
    this.router.navigate(['/dashboard/leave/edit', id]);
  }
  navigateToEdit(id: number): void {
    this.router.navigate(['/dashboard/leave/edit', id]);
  }
}