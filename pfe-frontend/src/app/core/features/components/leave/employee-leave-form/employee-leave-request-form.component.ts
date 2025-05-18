import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { LeaveRequestService } from 'src/app/core/features/components/leave/leave-request.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-leave-request-form',
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Header -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-800">Request Leave</h2>
              <p-button 
                icon="pi pi-arrow-left" 
                label="Back to Leaves" 
                styleClass="p-button-secondary p-button-sm" 
                (onClick)="onCancel()">
              </p-button>
            </div>
          </div>
          
          <!-- Form Content -->
          <div class="p-6">
            <p-toast></p-toast>
            
            <form [formGroup]="leaveRequestForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Leave Type -->
              <div class="form-field">
                <label for="leaveType" class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <p-dropdown 
                  id="leaveType"
                  formControlName="leave_type_id"
                  [options]="leaveTypes" 
                  optionLabel="name" 
                  optionValue="id"
                  placeholder="Select Leave Type"
                  styleClass="w-full"
                  [showClear]="true">
                </p-dropdown>
                <small class="text-red-500" *ngIf="leaveRequestForm.get('leave_type_id')?.invalid && leaveRequestForm.get('leave_type_id')?.touched">
                  Leave type is required
                </small>
              </div>
              
              <!-- Date Range -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Start Date -->
                <div class="form-field">
                  <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p-calendar 
                    id="startDate"
                    formControlName="start_date" 
                    [showIcon]="true"
                    dateFormat="yy-mm-dd"
                    [readonlyInput]="true"
                    styleClass="w-full"
                    inputStyleClass="w-full"
                    [minDate]="minDate">
                  </p-calendar>
                  <small class="text-red-500" *ngIf="leaveRequestForm.get('start_date')?.invalid && leaveRequestForm.get('start_date')?.touched">
                    Start date is required
                  </small>
                </div>
                
                <!-- End Date -->
                <div class="form-field">
                  <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <p-calendar 
                    id="endDate"
                    formControlName="end_date" 
                    [showIcon]="true"
                    dateFormat="yy-mm-dd"
                    [readonlyInput]="true"
                    styleClass="w-full"
                    inputStyleClass="w-full"
                    [minDate]="leaveRequestForm.get('start_date')?.value || minDate">
                  </p-calendar>
                  <small class="text-red-500" *ngIf="leaveRequestForm.get('end_date')?.invalid && leaveRequestForm.get('end_date')?.touched">
                    <span *ngIf="leaveRequestForm.get('end_date')?.hasError('required')">End date is required</span>
                    <span *ngIf="leaveRequestForm.get('end_date')?.hasError('invalidRange')">End date must be after start date</span>
                  </small>
                </div>
              </div>
              
              <!-- Days -->
              <div class="form-field">
                <label for="days" class="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <div class="flex items-center">
                  <p-inputNumber 
                    id="days"
                    formControlName="days" 
                    [showButtons]="false"
                    [min]="1"
                    [readonly]="true"
                    styleClass="w-full bg-gray-50 cursor-not-allowed"
                    inputStyleClass="bg-gray-50">
                  </p-inputNumber>
                  <div class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    Calculated automatically
                  </div>
                </div>
              </div>
              
              <!-- Reason -->
              <div class="form-field">
                <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">Reason <span class="text-gray-400 text-xs">(Optional)</span></label>
                <textarea 
                  pInputTextarea 
                  id="reason"
                  formControlName="reason" 
                  rows="3" 
                  placeholder="Please provide a reason for your leave request"
                  class="w-full resize-none">
                </textarea>
                <div class="flex justify-end">
                  <small class="text-gray-500 text-xs mt-1">
                    {{ leaveRequestForm.get('reason')?.value?.length || 0 }}/500 characters
                  </small>
                </div>
              </div>

              <!-- Summary Card -->
              <div class="bg-blue-50 border border-blue-100 rounded-lg p-4" *ngIf="isFormValid()">
                <h3 class="text-sm font-medium text-blue-800 mb-2">Leave Request Summary</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="text-gray-600">Leave Type:</div>
                  <div class="font-medium">{{ getLeaveTypeName() }}</div>
                  
                  <div class="text-gray-600">Start Date:</div>
                  <div class="font-medium">{{ formatDate(leaveRequestForm.get('start_date')?.value) }}</div>
                  
                  <div class="text-gray-600">End Date:</div>
                  <div class="font-medium">{{ formatDate(leaveRequestForm.get('end_date')?.value) }}</div>
                  
                  <div class="text-gray-600">Duration:</div>
                  <div class="font-medium">{{ leaveRequestForm.get('days')?.value }} day(s)</div>
                </div>
              </div>
              
              <!-- Error Message -->
              <p-message *ngIf="errorMessage" severity="error" text="{{ errorMessage }}" styleClass="w-full"></p-message>
              
              <!-- Form Actions -->
              <div class="flex justify-end gap-3 pt-4">
                <p-button 
                  type="button" 
                  label="Cancel" 
                  icon="pi pi-times" 
                  styleClass="p-button-secondary" 
                  (onClick)="onCancel()">
                </p-button>
                <p-button 
                  type="submit" 
                  label="Submit Request" 
                  icon="pi pi-check" 
                  [loading]="isSubmitting"
                  [disabled]="leaveRequestForm.invalid || isSubmitting">
                </p-button>
              </div>
            </form>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 border-t border-gray-200 px-6 py-3">
            <div class="text-xs text-gray-500">
              All leave requests are subject to manager approval. You will receive notification once your request has been processed.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-calendar, 
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-inputnumber,
    :host ::ng-deep .p-inputtext {
      width: 100%;
    }
    
    :host ::ng-deep .p-inputtext {
      padding: 0.5rem 0.75rem;
    }
    
    :host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
      padding: 0.5rem 0.75rem;
    }
  `],
  providers: [MessageService]
})
export class EmployeeLeaveRequestFormComponent implements OnInit {
  leaveRequestForm!: FormGroup;
  isSubmitting = false;
  leaveTypes: any[] = [];
  errorMessage: string = '';
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private leaveTypeService: LeaveTypeService,
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    // Set minDate to today
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.loadLeaveTypes();
    this.initializeForm();
    this.setupDateChangeListeners();
  }

  private loadLeaveTypes(): void {
    this.leaveTypeService.getAll().subscribe({
      next: (types) => this.leaveTypes = types,
      error: (err) => {
        console.error('Failed to load leave types', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load leave types'
        });
      }
    });
  }

  private initializeForm(): void {
    this.leaveRequestForm = this.fb.group({
      leave_type_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      days: [{value: '', disabled: true}, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.maxLength(500)]
    });
  }

  private setupDateChangeListeners(): void {
    this.leaveRequestForm.get('start_date')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveRequestForm.get('end_date')?.valueChanges.subscribe(() => this.calculateDays());
  }

  private calculateDays(): void {
    const startDate = this.leaveRequestForm.get('start_date')?.value;
    const endDate = this.leaveRequestForm.get('end_date')?.value;

    if (!startDate || !endDate) {
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      this.leaveRequestForm.get('end_date')?.setErrors({ invalidRange: true });
      return;
    }

    // Calculate difference in days (inclusive of both start and end dates)
    const diffInMs = Math.abs(end.getTime() - start.getTime());
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

    this.leaveRequestForm.get('days')?.setValue(diffInDays);
    this.leaveRequestForm.get('end_date')?.setErrors(null);
  }

  onSubmit(): void {
    if (this.leaveRequestForm.invalid || this.isSubmitting) {
      this.leaveRequestForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly'
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Enable the days field temporarily to get its value
    const daysControl = this.leaveRequestForm.get('days');
    daysControl?.enable();
    const formData = this.leaveRequestForm.value;
    daysControl?.disable();

    this.getEmployeeId().subscribe({
      next: (employeeId) => {
        const leaveRequestPayload = {
          employee_id: employeeId,
          leave_type_id: formData.leave_type_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          days: Number(formData.days),
          reason: formData.reason
        };

        this.leaveRequestService.create(leaveRequestPayload).pipe(
          finalize(() => this.isSubmitting = false)
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Leave request submitted successfully'
            });
            setTimeout(() => this.router.navigate(['/dashboard/leave']), 1500);
          },
          error: (err) => {
            console.error('Failed to create leave request', err);
            if (err.error?.message) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'An error occurred while creating the leave request.';
            }
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.errorMessage
            });
          }
        });
      },
      error: (err) => {
        console.error('Failed to get employee ID', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to get employee information.';
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage
        });
      }
    });
  }

  getEmployeeId(): Observable<number> {
    return this.authService.getLoggedInUser().pipe(
      map(user => {
        if (user && user.employee_id) {
          return user.employee_id;
        }
        throw new Error('Employee ID not found');
      }),
      catchError(error => {
        console.error('Error getting employee ID:', error);
        throw error;
      })
    );
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/leave']);
  }

  isFormValid(): boolean {
    return (this.leaveRequestForm.get('leave_type_id')?.valid ?? false) && 
           (this.leaveRequestForm.get('start_date')?.valid ?? false) && 
           (this.leaveRequestForm.get('end_date')?.valid ?? false) && 
           !(this.leaveRequestForm.get('end_date')?.hasError('invalidRange') ?? true);
  }

  getLeaveTypeName(): string {
    const typeId = this.leaveRequestForm.get('leave_type_id')?.value;
    const foundType = this.leaveTypes.find(type => type.id === typeId);
    return foundType ? foundType.name : '';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}