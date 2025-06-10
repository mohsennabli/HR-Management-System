import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { Employee } from 'src/app/models/employee.model';
import { DepartmentService } from '../../department/department.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
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
      birthDate: ['', [this.minimumAgeValidator.bind(this)]],
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
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Loading', 
      detail: 'Fetching departments and roles...'
    });

    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Departments loaded successfully'
        });
      },
      error: (err) => {
        console.error('Error fetching departments', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error Loading Departments', 
          detail: 'Failed to load departments. Please refresh the page or contact support.'
        });
      }
    });

    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Roles loaded successfully'
        });
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error Loading Roles', 
          detail: 'Failed to load roles. Please refresh the page or contact support.'
        });
      }
    });
  }

  onActiveIndexChange(event: number): void {
    this.activeIndex = event;
  }

  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Previous Step', 
        detail: `Returning to ${this.items[this.activeIndex].label}`
      });
    }
  }

  nextStep(): void {
    if (this.activeIndex < this.items.length - 1) {
      // Validate current step before proceeding
      if (this.isCurrentStepValid()) {
        this.activeIndex++;
        this.messageService.add({ 
          severity: 'info', 
          summary: 'Step Completed', 
          detail: `Moving to ${this.items[this.activeIndex].label}`
        });
      } else {
        this.messageService.add({ 
          severity: 'warn', 
          summary: 'Validation Required', 
          detail: 'Please complete all required fields in the current step before proceeding.'
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
      this.messageService.add({ 
        severity: 'info', 
        summary: 'User Account', 
        detail: 'Please provide email and role for the user account'
      });
    } else {
      emailControl?.clearValidators();
      roleControl?.clearValidators();
      emailControl?.setValue('');
      roleControl?.setValue('');
      this.messageService.add({ 
        severity: 'info', 
        summary: 'User Account', 
        detail: 'User account creation disabled'
      });
    }

    emailControl?.updateValueAndValidity();
    roleControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      // Check age validation before proceeding
      const birthDate = this.employeeForm.get('birthDate')?.value;
      if (birthDate) {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }

        if (age < 18) {
          this.messageService.add({
            severity: 'error',
            summary: 'Age Restriction',
            detail: 'Employee must be at least 18 years old.',
            sticky: true
          });
          return;
        }
      }

      this.isSubmitting = true;
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Processing', 
        detail: 'Creating employee record...'
      });

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
          summary: 'User Account Required', 
          detail: 'Email and role are required when creating a user account. Please complete the user account section.' 
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
            summary: 'Employee Created', 
            detail: `${employeeData.first_name} ${employeeData.last_name} has been successfully added to the system.`
          });

          // Show email status if user account was created
          if (response.email_status) {
            if (response.email_status.sent) {
              this.messageService.add({
                severity: 'success',
                summary: 'Login Credentials Sent',
                detail: `Login credentials have been sent to ${response.email_status.email}. Please check the inbox.`
              });
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Email Delivery Failed',
                detail: `Unable to send login credentials to ${response.email_status.email}. Please contact the system administrator for assistance.`
              });
            }
          }

          // Add a final success message before navigation
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Complete', 
            detail: 'Redirecting to employee list...'
          });

          setTimeout(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating employee:', error);
          
          // Handle validation errors
          if (error.error?.errors) {
            const errorMessages = Object.entries(error.error.errors as Record<string, string[]>)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('\n');
            
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Validation Error', 
              detail: errorMessages,
              sticky: true
            });
          } else {
            // Handle general errors
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Creation Failed', 
              detail: error.error?.error || 'An unexpected error occurred while creating the employee. Please try again.'
            });
          }

          // Mark form controls with errors
          if (error.error?.errors) {
            for (const key in error.error.errors) {
              if (this.employeeForm.controls[key]) {
                this.employeeForm.controls[key].setErrors({ backend: error.error.errors[key] });
              }
            }
          }
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Form Incomplete', 
        detail: 'Please complete all required fields and fix any validation errors before submitting.',
        sticky: true
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

  // Add custom validator for minimum age
  private minimumAgeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { minimumAge: true };
  }
}