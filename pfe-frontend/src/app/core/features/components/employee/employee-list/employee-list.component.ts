import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { ApiResponse, Employee } from 'src/app/models/employee.model';
import { DepartmentService } from '../../department/department.service';
import { Department } from 'src/app/models/department.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  providers: [MessageService]
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedDepartment: number | null = null;
  selectedEmployee: Employee | null = null;
  isModalOpen = false;
  isSidebarOpen = false;
  departments: Department[] = [];

  steps = [
    { label: 'Basic Info' },
    { label: 'Personal Info' },
    { label: 'CIN Info' },
    { label: 'CNSS & Bank' }
  ];
  activeStep = 0;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
    this.activeStep = 0;
  }

  loadDepartments(): void {
    console.log('Loading departments...');
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        console.log('Departments loaded:', response.data);
        this.departments = response.data;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load departments' });
      }
    });
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedDepartment) params.department_id = this.selectedDepartment;

    console.log('Loading employees with params:', params);
    console.log('Selected department:', this.selectedDepartment);

    this.employeeService.getAll(params).subscribe({
      next: (response: ApiResponse<Employee[]>) => {
        console.log('API Response:', response);
        this.employees = response.data.map(employee => {
          const processedEmployee = { ...employee };
          if (typeof employee.department === 'string') {
            processedEmployee.department = {
              id: employee.department_id,
              name: employee.department
            };
          }
          return processedEmployee;
        });
        console.log('Processed employees:', this.employees);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading employees:', error);
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
      next: (response) => {
        this.selectedEmployee = response.data;
        this.isSidebarOpen = true;
        this.activeStep = 0;
      },
      error: (err) => {
        console.error('Failed to load employee details', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee details' });
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmployee = null;
  }

  nextStep(): void {
    if (this.activeStep < this.steps.length - 1) {
      this.activeStep++;
    }
  }

  prevStep(): void {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  private handleError(message: string, error: any): void {
    this.error = message;
    this.loading = false;
    console.error(`${message}:`, error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  getDepartmentSeverity(departmentName: string | undefined): string {
    if (!departmentName) return 'info';
    
    switch (departmentName.toLowerCase()) {
      case 'it':
        return 'info';
      case 'hr':
        return 'warning';
      case 'finance':
        return 'success';
      case 'marketing':
        return 'help';
      default:
        return 'info';
    }
  }
}
