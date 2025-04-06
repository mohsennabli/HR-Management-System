import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrLeaveTypeService, LeaveType } from '../../../services/hr-leave-type.service';

@Component({
  selector: 'app-hr-leave-type-create',
  templateUrl: './hr-leave-type-create.component.html',
  styleUrls: ['./hr-leave-type-create.component.scss']
})
export class HrLeaveTypeCreateComponent {
  leaveTypeForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private leaveTypeService: HrLeaveTypeService,
    private router: Router
  ) {
    this.leaveTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      days_allowed: ['', [Validators.required, Validators.min(1)]],
      is_paid: [true]
    });
  }

  onSubmit(): void {
    if (this.leaveTypeForm.valid) {
      this.loading = true;
      this.error = '';
      
      const leaveType: LeaveType = {
        name: this.leaveTypeForm.value.name,
        description: this.leaveTypeForm.value.description,
        days_allowed: this.leaveTypeForm.value.days_allowed,
        is_paid: this.leaveTypeForm.value.is_paid
      };

      this.leaveTypeService.createLeaveType(leaveType).subscribe({
        next: (response) => {
          this.router.navigate(['/hr-dashboard/leave']);
        },
        error: (error) => {
          this.loading = false;
          if (error.error?.errors) {
            this.error = Object.values(error.error.errors).flat().join(', ');
          } else {
            this.error = 'Failed to create leave type. Please try again.';
          }
          console.error('Error creating leave type:', error);
        }
      });
    }
  }
} 