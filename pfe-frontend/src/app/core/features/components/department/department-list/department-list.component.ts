import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../department.service';
import { Department } from 'src/app/models/department.model';
  
@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load departments';
        this.isLoading = false;
      }
    });
  }

  deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.isLoading = true;
      this.errorMessage = '';

      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(dept => dept.id !== id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to delete department';
          this.isLoading = false;
        }
      });
    }
  }
}