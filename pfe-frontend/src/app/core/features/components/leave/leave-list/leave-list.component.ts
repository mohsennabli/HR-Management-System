import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveTypeService } from '../leave-type.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilterService } from 'primeng/api';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  providers: [MessageService, ConfirmationService, FilterService]
})
export class LeaveListComponent implements OnInit {
  leaveTypes: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.loading = true;
    this.leaveTypeService.getAll().subscribe({
      next: (data) => {
        this.leaveTypes = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load leave types';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error
        });
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/dashboard/leave/create']);
  }

  onEdit(leaveType: any): void {
    this.router.navigate(['/dashboard/leave/edit', leaveType.id]);
  }

  onDelete(leaveType: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${leaveType.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.leaveTypeService.delete(leaveType.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Leave type deleted successfully'
            });
            this.loadLeaveTypes();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete leave type'
            });
          }
        });
      }
    });
  }

  applyFilterGlobal(event: Event, matchMode: string): void {
    const value = (event.target as HTMLInputElement).value;
    this.leaveTypes = this.filterService.filter(
      this.leaveTypes,
      ['name', 'description'],
      value,
      matchMode
    );
  }
}