import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-create',
  templateUrl: './leave-create.component.html',
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    ToastModule
  ]
})
export class LeaveCreateComponent {
  leaveForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private leaveTypeService: LeaveTypeService,
    private messageService: MessageService
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
      isPaid: [false],
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

  private prepareLeaveTypeData(): any {
    return {
      name: this.leaveForm.value.name,
      description: this.leaveForm.value.description,
      days_allowed: Number(this.leaveForm.value.daysAllowed),
      is_paid: this.leaveForm.value.isPaid,
      carry_over: this.leaveForm.value.carryOver,
      max_carry_over: this.leaveForm.value.carryOver ? Number(this.leaveForm.value.maxCarryOver) : 0
    };
  }

  onSubmit(): void {
    if (this.leaveForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const leaveTypeData = this.prepareLeaveTypeData();

    this.leaveTypeService.create(leaveTypeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Leave type created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard/leave']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create leave type'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/leave']);
  }
}