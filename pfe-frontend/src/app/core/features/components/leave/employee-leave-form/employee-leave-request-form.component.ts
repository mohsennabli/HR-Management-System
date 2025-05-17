import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { LeaveRequestService } from 'src/app/core/features/components/leave/leave-request.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-leave-request-form',
  templateUrl: './employee-leave-request-form.component.html',
  styleUrls: ['./employee-leave-request-form.component.scss']
})
export class EmployeeLeaveRequestFormComponent implements OnInit {
  leaveRequestForm!: FormGroup;
  isSubmitting = false;
  leaveTypes: any[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private leaveTypeService: LeaveTypeService,
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLeaveTypes();
    this.initializeForm();
    this.setupDateChangeListeners();
  }

  private loadLeaveTypes(): void {
    this.leaveTypeService.getAll().subscribe({
      next: (types) => this.leaveTypes = types,
      error: (err) => console.error('Failed to load leave types', err)
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
            this.router.navigate(['/dashboard/leave-requests']);
          },
          error: (err) => {
            console.error('Failed to create leave request', err);
            if (err.error?.message) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'An error occurred while creating the leave request.';
            }
          }
        });
      },
      error: (err) => {
        console.error('Failed to get employee ID', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to get employee information.';
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
    this.router.navigate(['/dashboard']);
  }
}