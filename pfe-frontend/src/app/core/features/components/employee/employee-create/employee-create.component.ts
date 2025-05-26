import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { Employee } from 'src/app/models/employee.model';
import { DepartmentService } from '../../department/department.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-employee-create',
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Add New Employee</h2>
            <p-button label="Back to List" icon="pi pi-arrow-left" (onClick)="router.navigate(['../'])"></p-button>
          </div>

          <p-toast></p-toast>
          
          <p-steps [model]="items" [activeIndex]="activeIndex" [readonly]="false" (activeIndexChange)="onActiveIndexChange($event)"></p-steps>
          
          <div class="mt-6">
            <form [formGroup]="employeeForm">
              <!-- Step 1: Basic Information -->
              <div *ngIf="activeIndex === 0" class="step-content">
                <p-card header="Basic Information" styleClass="shadow-none border">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="field">
                      <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input pInputText id="firstName" formControlName="firstName" class="w-full" />
                      <small class="text-red-500" *ngIf="employeeForm.get('firstName')?.invalid && employeeForm.get('firstName')?.touched">
                        First name is required
                      </small>
                    </div>

                    <div class="field">
                      <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input pInputText id="lastName" formControlName="lastName" class="w-full" />
                      <small class="text-red-500" *ngIf="employeeForm.get('lastName')?.invalid && employeeForm.get('lastName')?.touched">
                        Last name is required
                      </small>
                    </div>

                    <div class="field">
                      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input pInputText id="phone" formControlName="phone" class="w-full" />
                      <small class="text-red-500" *ngIf="employeeForm.get('phone')?.invalid && employeeForm.get('phone')?.touched">
                        Phone number is required
                      </small>
                    </div>

                    <div class="field">
                      <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <p-dropdown id="department" formControlName="departmentId" [options]="departments" 
                        optionLabel="name" optionValue="id" placeholder="Select Department" class="w-full">
                      </p-dropdown>
                      <small class="text-red-500" *ngIf="employeeForm.get('departmentId')?.invalid && employeeForm.get('departmentId')?.touched">
                        Department is required
                      </small>
                    </div>

                    <div class="field">
                      <label for="position" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input pInputText id="position" formControlName="position" class="w-full" />
                      <small class="text-red-500" *ngIf="employeeForm.get('position')?.invalid && employeeForm.get('position')?.touched">
                        Position is required
                      </small>
                    </div>

                    <div class="field">
                      <label for="hireDate" class="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                      <p-calendar id="hireDate" formControlName="hireDate" [showIcon]="true" dateFormat="yy-mm-dd" class="w-full"></p-calendar>
                      <small class="text-red-500" *ngIf="employeeForm.get('hireDate')?.invalid && employeeForm.get('hireDate')?.touched">
                        Hire date is required
                      </small>
                    </div>

                    <div class="field">
                      <label for="salary" class="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                      <p-inputNumber id="salary" formControlName="salary" mode="currency" currency="USD" locale="en-US" class="w-full"></p-inputNumber>
                      <small class="text-red-500" *ngIf="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched">
                        Salary is required
                      </small>
                    </div>
                  </div>
                </p-card>
              </div>

              <!-- Step 2: Personal Information -->
              <div *ngIf="activeIndex === 1" class="step-content">
                <p-card header="Personal Information" styleClass="shadow-none border">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="field">
                      <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                      <p-calendar id="birthDate" formControlName="birthDate" [showIcon]="true" dateFormat="yy-mm-dd" class="w-full"></p-calendar>
                    </div>

                    <div class="field">
                      <label for="birthLocation" class="block text-sm font-medium text-gray-700 mb-1">Birth Location</label>
                      <input pInputText id="birthLocation" formControlName="birthLocation" class="w-full" />
                    </div>

                    <div class="field">
                      <label for="maritalStatus" class="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                      <p-dropdown id="maritalStatus" formControlName="maritalStatus" 
                        [options]="maritalStatuses" placeholder="Select Status" class="w-full">
                      </p-dropdown>
                    </div>

                    <div class="field flex items-center">
                      <p-checkbox id="hasDisabledChild" formControlName="hasDisabledChild" [binary]="true"></p-checkbox>
                      <label for="hasDisabledChild" class="ml-2 text-sm font-medium text-gray-700">Has Disabled Child</label>
                    </div>

                    <div class="field md:col-span-2">
                      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea pInputTextarea id="address" formControlName="address" rows="3" class="w-full"></textarea>
                    </div>

                    <div class="field">
                      <label for="diploma" class="block text-sm font-medium text-gray-700 mb-1">Diploma</label>
                      <input pInputText id="diploma" formControlName="diploma" class="w-full" />
                    </div>
                  </div>
                </p-card>
              </div>

              <!-- Step 3: CIN Information -->
              <div *ngIf="activeIndex === 2" class="step-content">
                <p-card header="CIN Information" styleClass="shadow-none border">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="field">
                      <label for="cinNumber" class="block text-sm font-medium text-gray-700 mb-1">CIN Number</label>
                      <input pInputText id="cinNumber" formControlName="cinNumber" class="w-full" />
                    </div>

                    <div class="field">
                      <label for="cinIssueDate" class="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                      <p-calendar id="cinIssueDate" formControlName="cinIssueDate" [showIcon]="true" dateFormat="yy-mm-dd" class="w-full"></p-calendar>
                    </div>

                    <div class="field">
                      <label for="cinIssueLocation" class="block text-sm font-medium text-gray-700 mb-1">Issue Location</label>
                      <input pInputText id="cinIssueLocation" formControlName="cinIssueLocation" class="w-full" />
                    </div>
                  </div>
                </p-card>
              </div>

              <!-- Step 4: CNSS and Bank Information -->
              <div *ngIf="activeIndex === 3" class="step-content">
                <p-card header="CNSS and Bank Information" styleClass="shadow-none border">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="field">
                      <label for="cnssNumber" class="block text-sm font-medium text-gray-700 mb-1">CNSS Registration Number</label>
                      <input pInputText id="cnssNumber" formControlName="cnssNumber" class="w-full" />
                    </div>

                    <div class="field">
                      <label for="bankAgency" class="block text-sm font-medium text-gray-700 mb-1">Bank Agency</label>
                      <input pInputText id="bankAgency" formControlName="bankAgency" class="w-full" />
                    </div>

                    <div class="field">
                      <label for="bankRib" class="block text-sm font-medium text-gray-700 mb-1">Bank RIB/RIP</label>
                      <input pInputText id="bankRib" formControlName="bankRib" class="w-full" />
                    </div>
                  </div>
                </p-card>
              </div>

              <!-- Step 5: User Account Section -->
              <div *ngIf="activeIndex === 4" class="step-content">
                <p-card header="User Account" styleClass="shadow-none border">
                  <div class="space-y-6">
                    <div class="flex items-center">
                      <p-checkbox id="isUser" formControlName="isUser" [binary]="true" (onChange)="onUserSwitchChange($event)"></p-checkbox>
                      <label for="isUser" class="ml-2 text-sm font-medium text-gray-700">Create User Account</label>
                    </div>

                    <div *ngIf="employeeForm.get('isUser')?.value" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field">
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input pInputText id="email" formControlName="email" class="w-full" />
                        <small class="text-red-500" *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched">
                          <div *ngIf="employeeForm.get('email')?.errors?.['required']">Email is required</div>
                          <div *ngIf="employeeForm.get('email')?.errors?.['email']">Please enter a valid email address</div>
                        </small>
                      </div>

                      <div class="field">
                        <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <p-dropdown id="role" formControlName="roleId" [options]="roles" 
                          optionLabel="name" optionValue="id" placeholder="Select Role" class="w-full">
                        </p-dropdown>
                        <small class="text-red-500" *ngIf="employeeForm.get('roleId')?.invalid && employeeForm.get('roleId')?.touched">
                          Role is required
                        </small>
                      </div>
                    </div>
                  </div>
                </p-card>
              </div>

              <!-- Navigation buttons -->
              <div class="flex justify-between mt-6">
                <p-button *ngIf="activeIndex > 0" label="Previous" icon="pi pi-arrow-left" (onClick)="prevStep()" styleClass="p-button-secondary"></p-button>
                <div class="flex gap-4">
                  <p-button *ngIf="activeIndex < items.length - 1" label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextStep()"></p-button>
                  <p-button *ngIf="activeIndex === items.length - 1" 
                    label="Save Employee" 
                    icon="pi pi-check" 
                    (onClick)="onSubmit()" 
                    [disabled]="employeeForm.invalid || isSubmitting"
                    [loading]="isSubmitting">
                  </p-button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [MessageService]
})
export class EmployeeCreateComponent implements OnInit {
  employeeForm: FormGroup;
  roles: any[] = [];
  departments: any;
  activeIndex = 0;
  items: MenuItem[];
  isSubmitting = false;
  
  maritalStatuses = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
    { label: 'Divorced', value: 'divorced' },
    { label: 'Widowed', value: 'widowed' }
  ];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private messageService: MessageService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      departmentId: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      salary: ['', Validators.required],
      birthDate: [''],
      birthLocation: [''],
      maritalStatus: [''],
      hasDisabledChild: [false],
      address: [''],
      diploma: [''],
      cinNumber: [''],
      cinIssueDate: [''],
      cinIssueLocation: [''],
      cnssNumber: [''],
      bankAgency: [''],
      bankRib: [''],
      pin: [''],
      isUser: [false],
      email: [''],
      roleId: ['']
    });
    
    this.items = [
      { label: 'Basic Info' },
      { label: 'Personal Info' },
      { label: 'CIN Info' },
      { label: 'CNSS & Bank' },
      { label: 'User Account' }
    ];
  }

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
      },
      error: (err) => {
        console.error('Error fetching departments', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load departments' });
      }
    });

    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load roles' });
      }
    });
  }

  onActiveIndexChange(event: number): void {
    this.activeIndex = event;
  }

  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  nextStep(): void {
    if (this.activeIndex < this.items.length - 1) {
      // Validate current step before proceeding
      if (this.isCurrentStepValid()) {
        this.activeIndex++;
      } else {
        this.messageService.add({ 
          severity: 'warn', 
          summary: 'Validation', 
          detail: 'Please complete all required fields before proceeding.'
        });
        this.markFormGroupTouched(this.getCurrentStepFormGroup());
      }
    }
  }

  isCurrentStepValid(): boolean {
    const currentGroup = this.getCurrentStepFormGroup();
    return currentGroup.valid;
  }

  getCurrentStepFormGroup(): FormGroup {
    // Create sub form groups based on the active step
    switch (this.activeIndex) {
      case 0: // Basic Info
        return this.fb.group({
          firstName: this.employeeForm.get('firstName'),
          lastName: this.employeeForm.get('lastName'),
          phone: this.employeeForm.get('phone'),
          departmentId: this.employeeForm.get('departmentId'),
          position: this.employeeForm.get('position'),
          hireDate: this.employeeForm.get('hireDate'),
          salary: this.employeeForm.get('salary')
        });
      case 1: // Personal Info - no required fields
        return this.fb.group({});
      case 2: // CIN Info - no required fields
        return this.fb.group({});
      case 3: // CNSS & Bank - no required fields
        return this.fb.group({});
      case 4: // User Account
        if (this.employeeForm.get('isUser')?.value) {
          return this.fb.group({
            email: this.employeeForm.get('email'),
            roleId: this.employeeForm.get('roleId')
          });
        }
        return this.fb.group({});
      default:
        return this.fb.group({});
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onUserSwitchChange(event: any): void {
    const isUser = event.checked;
    const emailControl = this.employeeForm.get('email');
    const roleControl = this.employeeForm.get('roleId');

    if (isUser) {
      emailControl?.setValidators([Validators.required, Validators.email]);
      roleControl?.setValidators([Validators.required]);
    } else {
      emailControl?.clearValidators();
      roleControl?.clearValidators();
      emailControl?.setValue('');
      roleControl?.setValue('');
    }

    emailControl?.updateValueAndValidity();
    roleControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;
      const formValue = this.employeeForm.value;
      
      // Format dates to YYYY-MM-DD
      const formatDate = (date: Date) => {
        if (!date) return null;
        return date instanceof Date ? date.toISOString().split('T')[0] : date;
      };

      const employeeData = {
        first_name: formValue.firstName,
        last_name: formValue.lastName,
        phone: formValue.phone,
        department_id: formValue.departmentId,
        position: formValue.position,
        hire_date: formatDate(formValue.hireDate),
        salary: formValue.salary,
        birth_date: formatDate(formValue.birthDate),
        birth_location: formValue.birthLocation,
        marital_status: formValue.maritalStatus,
        has_disabled_child: formValue.hasDisabledChild,
        address: formValue.address,
        diploma: formValue.diploma,
        cin_number: formValue.cinNumber,
        cin_issue_date: formatDate(formValue.cinIssueDate),
        cin_issue_location: formValue.cinIssueLocation,
        cnss_number: formValue.cnssNumber,
        bank_agency: formValue.bankAgency,
        bank_rib: formValue.bankRib,
        pin: formValue.pin,
        is_user: formValue.isUser,
        email: formValue.isUser ? formValue.email : null,
        role_id: formValue.isUser ? formValue.roleId : null
      };

      // Validate user account fields if is_user is true
      if (employeeData.is_user && (!employeeData.email || !employeeData.role_id)) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Validation Error', 
          detail: 'Email and role are required when creating a user account.' 
        });
        this.isSubmitting = false;
        return;
      }

      this.employeeService.create(employeeData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          
          // Show success message for employee creation
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Employee created successfully'
          });

          // Show email status if user account was created
          if (response.email_status) {
            if (response.email_status.sent) {
              this.messageService.add({
                severity: 'success',
                summary: 'Email Sent',
                detail: `Login credentials have been sent to ${response.email_status.email}`
              });
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Email Not Sent',
                detail: `Failed to send login credentials to ${response.email_status.email}. Please contact the administrator.`
              });
            }
          }

          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating employee:', error);
          if (error.error?.errors) {
            for (const key in error.error.errors) {
              if (this.employeeForm.controls[key]) {
                this.employeeForm.controls[key].setErrors({ backend: error.error.errors[key] });
              }
            }
          }
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.error?.error || 'Failed to create employee' 
          });
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please complete all required fields before submitting.' 
      });
      this.markAllFormGroupsTouched(this.employeeForm);
    }
  }
  
  markAllFormGroupsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}