import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HrEmployeeService, Employee, ApiResponse } from '../../../services/hr-employee.service';

@Component({
  selector: 'app-hr-employee-list',
  templateUrl: './hr-employee-list.component.html',
  styleUrls: ['./hr-employee-list.component.scss']
})
export class HrEmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error = '';
  selectedDepartment: any;
  searchTerm: any;

  constructor(
    private employeeService: HrEmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (response: ApiResponse<Employee[]>) => {
        this.employees = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load employees';
        this.loading = false;
        console.error('Error loading employees:', error);
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/hr-dashboard/employee/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error: any) => {
          this.error = 'Failed to delete employee';
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  filterEmployees(): void {
    // Implement filtering logic here
    console.log('Filtering employees:', { searchTerm: this.searchTerm, department: this.selectedDepartment });
  }
} 