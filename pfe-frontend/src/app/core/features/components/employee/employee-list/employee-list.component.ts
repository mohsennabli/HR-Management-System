import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { ApiResponse, Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-list', // Updated selector
  templateUrl: './employee-list.component.html', // Updated template URL
  styleUrls: ['./employee-list.component.scss'] // Updated style URL
})
export class EmployeeListComponent implements OnInit {
  
  employees: Employee[] = [];
  loading = false;
  error = '';
  searchTerm: string = '';
  selectedDepartment: string = '';
  


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

    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedDepartment) params.department = this.selectedDepartment;


    this.employeeService.getAll(params).subscribe({
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
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.delete(id).subscribe({
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
    this.loadEmployees();
  }
}