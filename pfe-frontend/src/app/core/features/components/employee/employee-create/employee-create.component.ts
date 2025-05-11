import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-create',
  template: `
    <div class="employee-create">
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
              <label for="phone">Phone</label>
              <input type="text" id="phone" formControlName="phone" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('phone')?.invalid && employeeForm.get('phone')?.touched">
                Phone number is required
              </div>
            </div>
            
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
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="position">Position</label>
              <input type="text" id="position" formControlName="position" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('position')?.invalid && employeeForm.get('position')?.touched">
                Position is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="hireDate">Hire Date</label>
              <input type="date" id="hireDate" formControlName="hireDate" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('hireDate')?.invalid && employeeForm.get('hireDate')?.touched">
                Hire date is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="salary">Salary</label>
              <input type="number" id="salary" formControlName="salary" class="form-control">
              <div class="error-message" *ngIf="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched">
                Salary is required
              </div>
            </div>
          </div>

          <div class="user-section">
            <div class="form-row">
              <div class="form-group">
                <label class="switch-label">
                  <input type="checkbox" formControlName="isUser" (change)="onUserSwitchChange($event)">
                  Create User Account
                </label>
              </div>
            </div>

            <div class="user-fields" *ngIf="employeeForm.get('isUser')?.value">
              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" formControlName="email" class="form-control">
                  <div class="error-message" *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched">
                    <div *ngIf="employeeForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="employeeForm.get('email')?.errors?.['email']">Please enter a valid email address</div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" id="password" formControlName="password" class="form-control">
                  <div class="error-message" *ngIf="employeeForm.get('password')?.invalid && employeeForm.get('password')?.touched">
                    <div *ngIf="employeeForm.get('password')?.errors?.['required']">Password is required</div>
                    <div *ngIf="employeeForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="role">Role</label>
                  <select id="role" formControlName="roleId" class="form-control">
                    <option value="">Select Role</option>
                    <option *ngFor="let role of roles" [value]="role.id">{{role.name}}</option>
                  </select>
                  <div class="error-message" *ngIf="employeeForm.get('roleId')?.invalid && employeeForm.get('roleId')?.touched">
                    Role is required
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="../">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="employeeForm.invalid">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .employee-create {
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
    .user-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .switch-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .user-fields {
      margin-top: 15px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  `]
})
export class EmployeeCreateComponent implements OnInit {
  employeeForm: FormGroup;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      isUser: [false],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]],
      roleId: ['']
    });
  }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  onUserSwitchChange(event: any): void {
    const isUser = event.target.checked;
    const emailControl = this.employeeForm.get('email');
    const passwordControl = this.employeeForm.get('password');
    const roleControl = this.employeeForm.get('roleId');

    if (isUser) {
      emailControl?.setValidators([Validators.required, Validators.email]);
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      roleControl?.setValidators([Validators.required]);
    } else {
      emailControl?.clearValidators();
      passwordControl?.clearValidators();
      roleControl?.clearValidators();
    }

    emailControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
    roleControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData = {
        first_name: formValue.firstName,
        last_name: formValue.lastName,
        phone: formValue.phone,
        department: formValue.department,
        position: formValue.position,
        hire_date: formValue.hireDate,
        salary: formValue.salary,
        is_user: formValue.isUser,
        email: formValue.email,
        password: formValue.password,
        role_id: formValue.roleId
      };
  
      console.log('Payload being sent:', employeeData);
  
      this.employeeService.create(employeeData).subscribe({
        next: (response) => {
          console.log('Employee created successfully:', response);
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          if (error.error?.errors) {
            for (const key in error.error.errors) {
              if (this.employeeForm.controls[key]) {
                this.employeeForm.controls[key].setErrors({ backend: error.error.errors[key] });
              }
            }
          }
        },
      });
    }
  }
}