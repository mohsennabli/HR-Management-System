import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
})
export class DepartmentCreateComponent {
  departmentForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.departmentService.createDepartment(this.departmentForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/departments']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error.message || 'Failed to create department';
          this.isLoading = false;
        }
      });
    }
  }
} 