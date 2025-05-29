import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-training-edit',
  template: `
    <div class="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <i class="pi pi-pencil text-2xl text-primary-600"></i>
        <h2 class="text-2xl font-semibold text-gray-800">Edit Training Program</h2>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
      </div>

      <!-- Error Message -->
      <p-message *ngIf="errorMessage" severity="error" [text]="errorMessage" styleClass="w-full"></p-message>

      <!-- Form Card -->
      <p-card *ngIf="!loading" styleClass="shadow-none border">
        <form [formGroup]="trainingForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Program Name -->
          <div class="field">
            <label for="programName" class="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-bookmark"></i>
              <input 
                pInputText 
                id="programName" 
                formControlName="programName" 
                placeholder="Enter program name"
                class="w-full"
                [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('programName')?.touched && trainingForm.get('programName')?.errors?.['required']}"
              >
            </span>
            <small class="text-red-500" *ngIf="trainingForm.get('programName')?.touched && trainingForm.get('programName')?.errors?.['required']">
              Program name is required
            </small>
          </div>

          <!-- Description -->
          <div class="field">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              pInputTextarea 
              id="description" 
              formControlName="description" 
              placeholder="Enter program description"
              [rows]="3"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('description')?.touched && trainingForm.get('description')?.errors?.['required']}"
            ></textarea>
            <small class="text-red-500" *ngIf="trainingForm.get('description')?.touched && trainingForm.get('description')?.errors?.['required']">
              Description is required
            </small>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <p-calendar 
                id="startDate" 
                formControlName="startDate" 
                [showIcon]="true"
                dateFormat="yy-mm-dd"
                [readonlyInput]="true"
                placeholder="Select start date"
                class="w-full"
                [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('startDate')?.touched && trainingForm.get('startDate')?.errors?.['required']}"
              ></p-calendar>
              <small class="text-red-500" *ngIf="trainingForm.get('startDate')?.touched && trainingForm.get('startDate')?.errors?.['required']">
                Start date is required
              </small>
            </div>

            <div class="field">
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <p-calendar 
                id="endDate" 
                formControlName="endDate" 
                [showIcon]="true"
                dateFormat="yy-mm-dd"
                [readonlyInput]="true"
                placeholder="Select end date"
                class="w-full"
                [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('endDate')?.touched && trainingForm.get('endDate')?.errors?.['required']}"
              ></p-calendar>
              <small class="text-red-500" *ngIf="trainingForm.get('endDate')?.touched && trainingForm.get('endDate')?.errors?.['required']">
                End date is required
              </small>
            </div>
          </div>

          <!-- Capacity -->
          <div class="field">
            <label for="capacity" class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-users"></i>
              <input 
                pInputText 
                type="number" 
                id="capacity" 
                formControlName="capacity" 
                placeholder="Enter maximum number of participants"
                class="w-full"
                min="1"
                [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('capacity')?.touched && trainingForm.get('capacity')?.errors?.['required']}"
              >
            </span>
            <small class="text-red-500" *ngIf="trainingForm.get('capacity')?.touched && trainingForm.get('capacity')?.errors?.['required']">
              Capacity is required
            </small>
          </div>

          <!-- Instructor -->
          <div class="field">
            <label for="instructor" class="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-user"></i>
              <input 
                pInputText 
                id="instructor" 
                formControlName="instructor" 
                placeholder="Enter instructor name"
                class="w-full"
                [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('instructor')?.touched && trainingForm.get('instructor')?.errors?.['required']}"
              >
            </span>
            <small class="text-red-500" *ngIf="trainingForm.get('instructor')?.touched && trainingForm.get('instructor')?.errors?.['required']">
              Instructor is required
            </small>
          </div>

          <!-- Location -->
          <div class="field">
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-map-marker"></i>
              <input 
                pInputText 
                id="location" 
                formControlName="location" 
                placeholder="Enter training location"
                class="w-full"
                [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('location')?.touched && trainingForm.get('location')?.errors?.['required']}"
              >
            </span>
            <small class="text-red-500" *ngIf="trainingForm.get('location')?.touched && trainingForm.get('location')?.errors?.['required']">
              Location is required
            </small>
          </div>

          <!-- Status -->
          <div class="field">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <p-dropdown
              id="status"
              formControlName="status"
              [options]="statusOptions"
              placeholder="Select status"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': trainingForm.get('status')?.touched && trainingForm.get('status')?.errors?.['required']}"
            ></p-dropdown>
            <small class="text-red-500" *ngIf="trainingForm.get('status')?.touched && trainingForm.get('status')?.errors?.['required']">
              Status is required
            </small>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <p-button 
              label="Cancel" 
              icon="pi pi-times" 
              styleClass="p-button-text" 
              (onClick)="onCancel()"
            ></p-button>
            <p-button 
              label="Save Changes" 
              icon="pi pi-check" 
              type="submit"
              [disabled]="!trainingForm.valid || loading"
              [loading]="loading"
            ></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
  providers: [MessageService]
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
        this.router.navigate(['/dashboard/training']);
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