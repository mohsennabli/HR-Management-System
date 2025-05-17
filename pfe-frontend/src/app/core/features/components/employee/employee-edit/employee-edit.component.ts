import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { ApiResponse, Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'] 
})
export class EmployeeEditComponent implements OnInit {
  currentDashboard: string | undefined;
  employeeForm: FormGroup;
  loading = false;
  error = '';
  employeeId = 0;
  roles: any[] = [];
  hasUserAccount = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role_id: ['']
    });
  }

  ngOnInit(): void {
    const urlSegments = this.router.url.split('/');
    this.currentDashboard = urlSegments[1] || 'admin';
    
    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('id')!;
      this.loadEmployee();
      this.loadRoles();
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate([`/${this.currentDashboard}/employees`]);
  }

  loadEmployee(): void {
    this.loading = true;
    this.employeeService.getById(this.employeeId).subscribe({
      next: (response: ApiResponse<Employee>) => {
        const employee = response.data;
        this.hasUserAccount = !!employee.user;
        
        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          phone: employee.phone,
          department_id: employee.department_id,
          position: employee.position,
          hire_date: employee.hire_date,
          salary: employee.salary,
          email: employee.user?.email || '',
          role_id: employee.user?.role_id || ''
        });

        // Only require password if creating new user account
        if (!this.hasUserAccount) {
          this.employeeForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        }

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
      const formData = this.employeeForm.value;
      
      // Only include user-related fields if they have values
      if (!formData.email) {
        delete formData.email;
        delete formData.password;
        delete formData.role_id;
      }

      this.employeeService.update(this.employeeId, formData).subscribe({
        next: (response: ApiResponse<Employee>) => {
          this.router.navigate(['../'], { relativeTo: this.route });
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