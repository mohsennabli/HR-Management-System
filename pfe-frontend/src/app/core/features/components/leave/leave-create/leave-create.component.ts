import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';

@Component({
  selector: 'app-leave-create',
  templateUrl: './leave-create.component.html',
  styleUrls: ['./leave-create.component.scss']
})
export class LeaveCreateComponent {
  leaveForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private leaveTypeService: LeaveTypeService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.leaveForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      daysAllowed: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(365)
      ]],
      isPaid: [true],
      carryOver: [false],
      maxCarryOver: [0, [Validators.min(0)]]
    });

    this.leaveForm.get('carryOver')?.valueChanges.subscribe(carryOver => {
      const maxCarryOverControl = this.leaveForm.get('maxCarryOver');
      if (carryOver) {
        maxCarryOverControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        maxCarryOverControl?.clearValidators();
        maxCarryOverControl?.setValue(0);
      }
      maxCarryOverControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const leaveTypeData = this.prepareLeaveTypeData();

    this.leaveTypeService.create(leaveTypeData).subscribe({
      next: () => {
        this.router.navigate(['/hr/leave']); // Updated to HR path
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating leave type:', error);
      }
    });
  }

  private prepareLeaveTypeData(): any {
    const formValue = this.leaveForm.value;
    return {
      name: formValue.name,
    description: formValue.description,
    days_allowed: Number(formValue.daysAllowed), // Snake case
    is_paid: formValue.isPaid, // Snake case
    carry_over: formValue.carryOver, // Snake case
    max_carry_over: formValue.carryOver ? Number(formValue.maxCarryOver) : 0 // Snake case
    };
  }

  onCancel(): void {
    this.router.navigate(['/hr/leave']); // Updated to HR path
  }
}