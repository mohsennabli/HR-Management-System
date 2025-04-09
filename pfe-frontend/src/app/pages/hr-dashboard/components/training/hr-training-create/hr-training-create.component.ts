import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrTrainingProgramService } from 'src/app/services/hr/training-program.service';
@Component({
  selector: 'app-hr-training-create',
  template: `
    <div class="hr-training-create">
      <div class="page-header">
        <h2>Add New Training Program</h2>
      </div>
      
      <form [formGroup]="trainingForm" (ngSubmit)="onSubmit()" class="training-form text-black">
        <div class="form-group">
          <label for="programName">Program Name</label>
          <input 
            type="text" 
            id="programName" 
            formControlName="programName" 
            placeholder="Enter program name"
            class="form-control"
          >
          <div class="error-message" *ngIf="trainingForm.get('programName')?.touched && trainingForm.get('programName')?.errors?.['required']">
            Program name is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            formControlName="description" 
            placeholder="Enter program description"
            class="form-control"
            rows="3"
          ></textarea>
          <div class="error-message" *ngIf="trainingForm.get('description')?.touched && trainingForm.get('description')?.errors?.['required']">
            Description is required
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input 
              type="date" 
              id="startDate" 
              formControlName="startDate" 
              class="form-control"
            >
            <div class="error-message" *ngIf="trainingForm.get('startDate')?.touched && trainingForm.get('startDate')?.errors?.['required']">
              Start date is required
            </div>
          </div>

          <div class="form-group">
            <label for="endDate">End Date</label>
            <input 
              type="date" 
              id="endDate" 
              formControlName="endDate" 
              class="form-control"
            >
            <div class="error-message" *ngIf="trainingForm.get('endDate')?.touched && trainingForm.get('endDate')?.errors?.['required']">
              End date is required
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="capacity">Capacity</label>
          <input 
            type="number" 
            id="capacity" 
            formControlName="capacity" 
            placeholder="Enter maximum number of participants"
            class="form-control"
            min="1"
          >
          <div class="error-message" *ngIf="trainingForm.get('capacity')?.touched && trainingForm.get('capacity')?.errors?.['required']">
            Capacity is required
          </div>
        </div>

        <div class="form-group">
          <label for="instructor">Instructor</label>
          <input 
            type="text" 
            id="instructor" 
            formControlName="instructor" 
            placeholder="Enter instructor name"
            class="form-control"
          >
          <div class="error-message" *ngIf="trainingForm.get('instructor')?.touched && trainingForm.get('instructor')?.errors?.['required']">
            Instructor is required
          </div>
        </div>

        <div class="form-group">
          <label for="location">Location</label>
          <input 
            type="text" 
            id="location" 
            formControlName="location" 
            placeholder="Enter training location"
            class="form-control"
          >
          <div class="error-message" *ngIf="trainingForm.get('location')?.touched && trainingForm.get('location')?.errors?.['required']">
            Location is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="!trainingForm.valid">Create Training Program</button>
          <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .hr-training-create {
      padding: 20px;
    }
    .page-header {
      margin-bottom: 20px;
    }
    .page-header h2 {
      margin: 0;
    }
    .training-form {
      max-width: 800px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-row {
      display: flex;
      gap: 20px;
    }
    .form-row .form-group {
      flex: 1;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }
    textarea.form-control {
      resize: vertical;
    }
    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    .btn-primary:hover {
      background-color: #2980b9;
    }
    .btn-primary:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #7f8c8d;
    }
  `]
})
export class HrTrainingCreateComponent implements OnInit {
  trainingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private trainingService: HrTrainingProgramService // <-- Injecté ici
  ) {
    this.trainingForm = this.fb.group({
      programName: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      instructor: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.trainingForm.valid) {
      const formData = {
        name: this.trainingForm.value.programName,
        description: this.trainingForm.value.description,
        start_date: this.trainingForm.value.startDate,
        end_date: this.trainingForm.value.endDate,
        capacity: this.trainingForm.value.capacity,
        instructor: this.trainingForm.value.instructor,
        location: this.trainingForm.value.location,
        status: 'upcoming' // valeur par défaut d’après ta BDD
      };

      this.trainingService.create(formData).subscribe({
        next: (res) => {
          console.log('Training program created:', res);
          this.router.navigate(['/hr-dashboard/training']);
        },
        error: (err) => {
          console.error('Error creating training program:', err);
          // ici tu peux afficher un message d'erreur à l'utilisateur
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/hr-dashboard/training']);
  }
}