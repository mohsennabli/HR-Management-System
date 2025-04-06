import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-leave-create',
  template: `
    <div class="hr-leave-create">
      <div class="page-header">
        <h2>Add New Leave Type</h2>
      </div>
      
      <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="leave-form">
        <div class="form-group">
          <label for="leaveType">Leave Type</label>
          <input 
            type="text" 
            id="leaveType" 
            formControlName="leaveType" 
            placeholder="Enter leave type name"
            class="form-control"
          >
          <div class="error-message" *ngIf="leaveForm.get('leaveType')?.touched && leaveForm.get('leaveType')?.errors?.['required']">
            Leave type is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            formControlName="description" 
            placeholder="Enter leave type description"
            class="form-control"
            rows="3"
          ></textarea>
          <div class="error-message" *ngIf="leaveForm.get('description')?.touched && leaveForm.get('description')?.errors?.['required']">
            Description is required
          </div>
        </div>

        <div class="form-group">
          <label for="daysAllocated">Days Allocated</label>
          <input 
            type="number" 
            id="daysAllocated" 
            formControlName="daysAllocated" 
            placeholder="Enter number of days"
            class="form-control"
            min="0"
          >
          <div class="error-message" *ngIf="leaveForm.get('daysAllocated')?.touched && leaveForm.get('daysAllocated')?.errors?.['required']">
            Days allocated is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="!leaveForm.valid">Save Leave Type</button>
          <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .hr-leave-create {
      padding: 20px;
    }
    .page-header {
      margin-bottom: 20px;
    }
    .page-header h2 {
      margin: 0;
    }
    .leave-form {
      max-width: 600px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 20px;
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
export class HrLeaveCreateComponent implements OnInit {
  leaveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      description: ['', Validators.required],
      daysAllocated: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      // TODO: Implement leave type creation logic
      console.log('Form submitted:', this.leaveForm.value);
      this.router.navigate(['/hr-dashboard/leave']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/hr-dashboard/leave']);
  }
} 