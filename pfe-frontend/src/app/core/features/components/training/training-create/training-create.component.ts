import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-training-create',
  templateUrl: './training-create.component.html',
  providers: [MessageService]
})
export class TrainingCreateComponent implements OnInit {
  trainingForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingProgramService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupDateChangeListeners();
  }

  private initializeForm(): void {
    this.trainingForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      instructor: ['', Validators.required],
      location: ['', Validators.required],
      status: ['upcoming', Validators.required]
    });
  }

  private setupDateChangeListeners(): void {
    this.trainingForm.get('start_date')?.valueChanges.subscribe(() => {
      this.validateDates();
    });

    this.trainingForm.get('end_date')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private validateDates(): void {
    const startDate = this.trainingForm.get('start_date')?.value;
    const endDate = this.trainingForm.get('end_date')?.value;

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        this.trainingForm.get('end_date')?.setErrors({ invalidDate: true });
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Date',
          detail: 'End date must be after start date'
        });
      } else {
        this.trainingForm.get('end_date')?.setErrors(null);
      }
    }
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.isSubmitting = true;
      this.trainingService.create(this.trainingForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Training program created successfully'
          });
          this.router.navigate(['/dashboard/training']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create training program'
          });
          console.error('Error creating training program:', error);
        }
      });
    } else {
      this.trainingForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/training']);
  }
}