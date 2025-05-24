import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { LeaveRequestService } from 'src/app/core/features/components/leave/leave-request.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-employee-leave-request-form',
  templateUrl: './employee-leave-request-form.component.html',
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    MessageModule
  ]
})
export class EmployeeLeaveRequestFormComponent implements OnInit {
  leaveRequestForm: FormGroup;
  leaveTypes: any[] = [];
  isSubmitting = false;
  errorMessage: string | undefined;
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private leaveRequestService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.leaveRequestForm = this.fb.group({
      leave_type_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      days: [0, Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Subscribe to date changes to calculate days
    this.leaveRequestForm.get('start_date')?.valueChanges.subscribe(() => {
      this.calculateDays();
    });

    this.leaveRequestForm.get('end_date')?.valueChanges.subscribe(() => {
      this.calculateDays();
    });
  }

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.leaveTypeService.getAll().subscribe({
      next: (types) => {
        this.leaveTypes = types;
      },
      error: (error) => {
        console.error('Error loading leave types:', error);
        this.errorMessage = 'Failed to load leave types. Please try again.';
      }
    });
  }

  calculateDays(): void {
    const startDate = this.leaveRequestForm.get('start_date')?.value;
    const endDate = this.leaveRequestForm.get('end_date')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        this.leaveRequestForm.get('end_date')?.setErrors({ invalidRange: true });
        this.leaveRequestForm.get('days')?.setValue(0);
        return;
      }

      // Calculate business days (excluding weekends)
      let days = 0;
      const current = new Date(start);
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) { // Skip Sunday (0) and Saturday (6)
          days++;
        }
        current.setDate(current.getDate() + 1);
      }

      this.leaveRequestForm.get('days')?.setValue(days);
    }
  }

  onSubmit(): void {
    if (this.leaveRequestForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = undefined;

      const formData = {
        ...this.leaveRequestForm.value,
        start_date: this.formatDate(this.leaveRequestForm.value.start_date),
        end_date: this.formatDate(this.leaveRequestForm.value.end_date)
      };

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

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}