import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { ApiResponse, Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'] 
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  error = '';
  employeeId = 0;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
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
    this.employeeService.getById(this.employeeId).subscribe({
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
      this.employeeService.update(this.employeeId, this.employeeForm.value).subscribe({
        next: (response: ApiResponse<Employee>) => {
          this.router.navigate(['/dashboard/employee']); 
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