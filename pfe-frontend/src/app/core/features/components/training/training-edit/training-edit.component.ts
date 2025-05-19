import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-training-edit',
  templateUrl: './training-edit.component.html',
  styleUrls: ['./training-edit.component.scss']
})
export class TrainingEditComponent implements OnInit {
  trainingForm: FormGroup;
  trainingId!: number;
  loading = false;
  errorMessage: string | null = null;
  statusOptions = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingProgramService,
    private messageService: MessageService
  ) {
    this.trainingForm = this.fb.group({
      programName: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      instructor: ['', Validators.required],
      location: ['', Validators.required],
      status: ['upcoming', Validators.required]
    });
  }

  ngOnInit(): void {
    this.trainingId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.trainingId) {
      this.loadTrainingProgram();
    }
  }

  loadTrainingProgram(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.trainingService.getById(this.trainingId).subscribe({
      next: (response) => {
        const programData = response.data || response;
        
        if (!programData) {
          this.errorMessage = 'Training program not found';
          this.loading = false;
          return;
        }
  
        // Format dates
        const startDate = programData.start_date ? new Date(programData.start_date).toISOString().split('T')[0] : '';
        const endDate = programData.end_date ? new Date(programData.end_date).toISOString().split('T')[0] : '';
        
        this.trainingForm.patchValue({
          programName: programData.name || '',
          description: programData.description || '',
          startDate: startDate,
          endDate: endDate,
          capacity: programData.capacity || '',
          instructor: programData.instructor || '',
          location: programData.location || '',
          status: programData.status || 'upcoming'
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load training program details';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load training program details'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.trainingForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;

    const formData = {
      name: this.trainingForm.value.programName,
      description: this.trainingForm.value.description,
      start_date: this.trainingForm.value.startDate,
      end_date: this.trainingForm.value.endDate,
      capacity: this.trainingForm.value.capacity,
      instructor: this.trainingForm.value.instructor,
      location: this.trainingForm.value.location,
      status: this.trainingForm.value.status
    };

    this.trainingService.update(this.trainingId, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Training program updated successfully'
        });
        this.router.navigate(['/training/list']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to save training program';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save training program'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/training']);
  }
}