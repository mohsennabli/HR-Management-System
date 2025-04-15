import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';
import { LeaveType } from 'src/app/models/leave-type.model';

@Component({
  selector: 'app-leave-edit',
  templateUrl: './leave-edit.component.html',
  styleUrls: ['./leave-edit.component.scss']
})
export class LeaveEditComponent implements OnInit {
  leaveForm: FormGroup;
  leaveId!: number; // Added definite assignment assertion
  loading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private leaveTypeService: LeaveTypeService
  ) {
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
  }

  ngOnInit(): void {
    this.leaveId = +this.route.snapshot.paramMap.get('id')!;
    this.loadLeaveType();
  }

  loadLeaveType(): void {
    this.loading = true;
    this.leaveTypeService.getById(this.leaveId).subscribe({
      next: (leaveType) => {
        this.leaveForm.patchValue({
          name: leaveType.name,
          description: leaveType.description,
          daysAllowed: leaveType.daysAllowed,
          isPaid: leaveType.isPaid,
          carryOver: leaveType.carryOver,
          maxCarryOver: leaveType.maxCarryOver || 0
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load leave type';
        this.router.navigate(['/leave']);
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const leaveTypeData = this.prepareLeaveTypeData();

    this.leaveTypeService.update(this.leaveId, leaveTypeData).subscribe({
      next: () => {
        this.router.navigate(['/leave']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
      }
    });
  }

  private prepareLeaveTypeData(): Partial<LeaveType> {
    const formValue = this.leaveForm.value;
    return {
      name: formValue.name,
      description: formValue.description,
      daysAllowed: Number(formValue.daysAllowed),
      isPaid: formValue.isPaid,
      carryOver: formValue.carryOver,
      maxCarryOver: formValue.carryOver ? Number(formValue.maxCarryOver) : 0
    };
  }

  private handleError(error: any): void {
    this.errorMessage = 'Failed to update leave type';
    
    if (error.error?.errors) {
      this.errorMessage = Object.values(error.error.errors).join(', ');
    }
  }

  onCancel(): void {
    this.router.navigate(['/leave']);
  }

  get name() { return this.leaveForm.get('name'); }
  get description() { return this.leaveForm.get('description'); }
  get daysAllowed() { return this.leaveForm.get('daysAllowed'); }
  get maxCarryOver() { return this.leaveForm.get('maxCarryOver'); }
}