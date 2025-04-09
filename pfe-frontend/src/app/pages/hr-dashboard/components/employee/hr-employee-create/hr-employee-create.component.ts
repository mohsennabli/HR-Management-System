import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrEmployeeService } from '../../../services/hr-employee.service';

@Component({
  selector: 'app-hr-employee-create',
  template: `
    <div class="hr-employee-create">
      <div class="page-header">
        <h2>Add New Employee</h2>
      </div>
      
      <div class="form-container">
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="employee-form text-black">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" formControlName="firstName" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('firstName')?.invalid && employeeForm.get('firstName')?.touched">
                First name is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" formControlName="lastName" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('lastName')?.invalid && employeeForm.get('lastName')?.touched">
                Last name is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched">
                Please enter a valid email
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="text" id="phone" formControlName="phone" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('phone')?.invalid && employeeForm.get('phone')?.touched">
                Phone number is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="department">Department</label>
              <select id="department" formControlName="department" class="form-control">
                <option value="">Select Department</option>
                <option value="it">IT</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
              </select>
              <div class="error-message" *ngIf="employeeForm.get('department')?.invalid && employeeForm.get('department')?.touched">
                Department is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="position">Position</label>
              <input type="text" id="position" formControlName="position" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('position')?.invalid && employeeForm.get('position')?.touched">
                Position is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="hireDate">Hire Date</label>
              <input type="date" id="hireDate" formControlName="hireDate" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('hireDate')?.invalid && employeeForm.get('hireDate')?.touched">
                Hire date is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="salary">Salary</label>
              <input type="number" id="salary" formControlName="salary" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched">
                Salary is required
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/hr-dashboard/employee">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="employeeForm.invalid">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .hr-employee-create {
      padding: 20px;
    }
    .page-header {
      margin-bottom: 20px;
    }
    .form-container {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }
    .form-group {
      flex: 1;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class HrEmployeeCreateComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: HrEmployeeService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Initialize component
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      // Map form values to match backend API expectations
      const employeeData = {
        first_name: this.employeeForm.value.firstName,
        last_name: this.employeeForm.value.lastName,
        email: this.employeeForm.value.email,
        phone: this.employeeForm.value.phone,
        department: this.employeeForm.value.department,
        position: this.employeeForm.value.position,
        hire_date: this.employeeForm.value.hireDate,
        salary: this.employeeForm.value.salary
      };
      
      // Call service to save employee
      this.employeeService.createEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee created successfully:', response);
          // Navigate back to employee list
          this.router.navigate(['/hr-dashboard/employee']);
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          // Handle error (show error message to user)
        }
      });
    }
  }
} 