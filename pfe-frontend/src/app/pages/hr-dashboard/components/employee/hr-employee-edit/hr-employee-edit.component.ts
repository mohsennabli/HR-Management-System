import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HrEmployeeService, Employee, ApiResponse } from '../../../services/hr-employee.service';

@Component({
  selector: 'app-hr-employee-edit',
  templateUrl: './hr-employee-edit.component.html',
  styleUrls: ['./hr-employee-edit.component.scss']
})
export class HrEmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  error = '';
  employeeId = 0;

  constructor(
    private fb: FormBuilder,
    private employeeService: HrEmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.loading = true;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (response: ApiResponse<Employee>) => {
        const employee = response.data;
        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          position: employee.position,
          hire_date: employee.hire_date,
          salary: employee.salary
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load employee';
        this.loading = false;
        console.error('Error loading employee:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
        next: (response: ApiResponse<Employee>) => {
          this.router.navigate(['/hr-dashboard/employee']);
        },
        error: (error: any) => {
          this.error = 'Failed to update employee';
          this.loading = false;
          console.error('Error updating employee:', error);
        }
      });
    }
  }
} 