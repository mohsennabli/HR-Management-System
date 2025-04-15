import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { LeaveType } from 'src/app/models/leave-type.model';

@Component({
  selector: 'app-leave-type-create',
  templateUrl: './leave-type-create.component.html',
  styleUrls: ['./leave-type-create.component.scss']
})
export class LeaveTypeCreateComponent {
  leaveTypeForm!: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private leaveTypeService: LeaveTypeService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.leaveTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      days_allowed: ['', [
        Validators.required, 
        Validators.min(1),
        Validators.max(365)
      ]],
      is_paid: [true],
      carry_over: [false],
      max_carry_over: [0, [Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.leaveTypeForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const leaveType: LeaveType = {
      ...this.leaveTypeForm.value,
      // Ensure numeric values
      days_allowed: Number(this.leaveTypeForm.value.days_allowed),
      max_carry_over: Number(this.leaveTypeForm.value.max_carry_over)
    };

    this.leaveTypeService.create(leaveType).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/hr/leave']), 1500);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.leaveTypeForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private handleError(error: any): void {
    this.loading = false;
    if (error.error?.errors) {
      this.error = Object.values(error.error.errors)
        .flat()
        .join(', ');
    } else {
      this.error = 'Failed to create leave type. Please try again.';
    }
    console.error('Error creating leave type:', error);
  }
}