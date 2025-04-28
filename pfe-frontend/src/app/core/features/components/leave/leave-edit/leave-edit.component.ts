import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveTypeService } from 'src/app/core/features/components/leave/leave-type.service';

@Component({
  selector: 'app-leave-edit',
  templateUrl: './leave-edit.component.html',
  styleUrls: ['./leave-edit.component.scss']
})
export class LeaveEditComponent implements OnInit {
  leaveForm: FormGroup;
  leaveId!: number;
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

  ngOnInit(): void {
    this.leaveId = +this.route.snapshot.paramMap.get('id')!;
    this.loadLeaveType();
  }

  loadLeaveType(): void {
    this.loading = true;
    this.leaveTypeService.getById(this.leaveId).subscribe({
      next: (response: any) => {
        console.log('RAW API RESPONSE:', response); // Debug raw response
  
        // Ensure we're accessing the data property if response is wrapped
        const responseData = response.data ? response.data : response;
        
        // Map all fields with proper fallbacks
        const leaveData = {
          name: responseData.name || '',
          description: responseData.description || '',
          daysAllowed: responseData.days_allowed?.toString() || '', // Convert to string for input
          isPaid: this.convertToBoolean(responseData.is_paid),
          carryOver: this.convertToBoolean(responseData.carry_over),
          maxCarryOver: Number(responseData.max_carry_over) || 0
        };
  
        console.log('PROCESSED FORM DATA:', leaveData); // Debug processed data
        
        this.leaveForm.patchValue(leaveData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leave type:', error);
        this.errorMessage = 'Failed to load leave type';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const leaveTypeData = {
      name: this.leaveForm.value.name,
      description: this.leaveForm.value.description,
      days_allowed: Number(this.leaveForm.value.daysAllowed),
      is_paid: this.leaveForm.value.isPaid,
      carry_over: this.leaveForm.value.carryOver,
      max_carry_over: this.leaveForm.value.carryOver ? Number(this.leaveForm.value.maxCarryOver) : 0
    };

    this.leaveTypeService.update(this.leaveId, leaveTypeData).subscribe({
      next: () => {
        this.router.navigate(['/leave']);
      },
      error: (error) => {
        console.error('Update error:', error);
        this.errorMessage = error.error?.message || 'Failed to update leave type';
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/leave']);
  }
  private convertToBoolean(value: any): boolean {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  get name() { return this.leaveForm.get('name'); }
  get description() { return this.leaveForm.get('description'); }
  get daysAllowed() { return this.leaveForm.get('daysAllowed'); }
  get maxCarryOver() { return this.leaveForm.get('maxCarryOver'); }
}