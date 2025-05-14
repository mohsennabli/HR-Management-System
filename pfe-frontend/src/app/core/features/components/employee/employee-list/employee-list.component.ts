import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { ApiResponse, Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedDepartment = '';
  selectedEmployee: Employee | null = null;
  isModalOpen = false;
  isSidebarOpen = false;

  departments = [
    { label: 'All Departments', value: '' },
    { label: 'IT', value: 'it' },
    { label: 'HR', value: 'hr' },
    { label: 'Finance', value: 'finance' },
    { label: 'Marketing', value: 'marketing' }
  ];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedDepartment) params.department = this.selectedDepartment;

    this.employeeService.getAll(params).subscribe({
      next: (response: ApiResponse<Employee[]>) => {
        this.employees = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.handleError('Failed to load employees', error);
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.delete(id).subscribe({
        next: () => this.loadEmployees(),
        error: (error: any) => this.handleError('Failed to delete employee', error)
      });
    }
  }

  filterEmployees(): void {
    this.loadEmployees();
  }

 onView(id: number) {
  this.employeeService.getById(id).subscribe({
    next: (data) => {
      this.selectedEmployee = data;
      this.isSidebarOpen = true;
    },
    error: (err) => {
      console.error('Failed to load employee details', err);
    }
  });
}


  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmployee = null;
  }

  private handleError(message: string, error: any): void {
    this.error = message;
    this.loading = false;
    console.error(`${message}:`, error);
  }
}
