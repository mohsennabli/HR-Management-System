import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
})
export class DepartmentEditComponent implements OnInit {
  departmentForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  departmentId: number;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]]
    });
    this.departmentId = 0;
  }

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartment();
  }

  loadDepartment() {
    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (response) => {
        const department = response.data || response;
        if (department) {
          this.departmentForm.patchValue({
            name: department.name
          });
        } else {
          this.errorMessage = 'Department not found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load department';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.departmentService.updateDepartment(this.departmentId, this.departmentForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/departments']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error.message || 'Failed to update department';
          this.isLoading = false;
        }
      });
    }
  }
} 