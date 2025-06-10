import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { Employee } from 'src/app/models/employee.model';
import { DepartmentService } from '../../department/department.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  providers: [MessageService]
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  roles: any[] = [];
  departments: any;
  employeeId!: number;
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
      salary: ['', [Validators.required, Validators.min(0)]],
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
      isUser: [false],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]],
      roleId: [''],
      pin:['']
    });
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

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

    this.employeeService.getById(this.employeeId).subscribe({
      next: (response) => {
        const employee = response.data;
        this.employeeForm.patchValue({
          firstName: employee.first_name,
          lastName: employee.last_name,
          phone: employee.phone,
          departmentId: employee.department_id,
          position: employee.position,
          hireDate: new Date(employee.hire_date),
          salary: employee.salary,
          birthDate: employee.birth_date ? new Date(employee.birth_date) : null,
          birthLocation: employee.birth_location,
          maritalStatus: employee.marital_status,
          hasDisabledChild: employee.has_disabled_child,
          address: employee.address,
          diploma: employee.diploma,
          cinNumber: employee.cin_number,
          cinIssueDate: employee.cin_issue_date ? new Date(employee.cin_issue_date) : null,
          cinIssueLocation: employee.cin_issue_location,
          cnssNumber: employee.cnss_number,
          bankAgency: employee.bank_agency,
          bankRib: employee.bank_rib,
          isUser: employee.is_user,
          email: employee.email,
          roleId: employee.role_id,
          pin:employee.pin
        });
        this.employeeForm.controls['pin'].disable();
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee details' });
      }
    });
  }

  onUserSwitchChange(event: any): void {
    const isUser = event.checked;
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
        department_id: formValue.departmentId,
        position: formValue.position,
        hire_date: formValue.hireDate,
        salary: formValue.salary,
        birth_date: formValue.birthDate,
        birth_location: formValue.birthLocation,
        marital_status: formValue.maritalStatus,
        has_disabled_child: formValue.hasDisabledChild,
        address: formValue.address,
        diploma: formValue.diploma,
        cin_number: formValue.cinNumber,
        cin_issue_date: formValue.cinIssueDate,
        cin_issue_location: formValue.cinIssueLocation,
        cnss_number: formValue.cnssNumber,
        bank_agency: formValue.bankAgency,
        bank_rib: formValue.bankRib,
        is_user: formValue.isUser,
        email: formValue.email,
        password: formValue.password,
        role_id: formValue.roleId
      };

      this.employeeService.update(this.employeeId, employeeData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully' });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          if (error.error?.errors) {
            for (const key in error.error.errors) {
              if (this.employeeForm.controls[key]) {
                this.employeeForm.controls[key].setErrors({ backend: error.error.errors[key] });
              }
            }
          }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update employee' });
        }
      });
    }
  }
}