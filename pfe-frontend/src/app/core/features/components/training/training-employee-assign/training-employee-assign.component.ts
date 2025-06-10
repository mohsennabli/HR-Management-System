import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { DepartmentService } from 'src/app/core/features/components/department/department.service';
import { TrainingParticipantService } from '../training-participant.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Employee } from 'src/app/models/employee.model';

interface EmployeeWithSelection extends Employee {
  selected: boolean;
}

interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-training-employee-assign',
  templateUrl: './training-employee-assign.component.html',
  styleUrls: ['./training-employee-assign.component.css']
})
export class TrainingEmployeeAssignComponent implements OnInit {
  trainingId: number;
  employees: EmployeeWithSelection[] = [];
  filteredEmployees: EmployeeWithSelection[] = [];
  departments: Department[] = [];
  selectedDepartment: number | null = null;
  searchQuery: string = '';
  isLoading: boolean = false;
  hasChanges: boolean = false;
  assignedEmployeeIds: Set<number> = new Set();
  selectedCount: number = 0;
  totalCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private trainingParticipantService: TrainingParticipantService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.trainingId = this.config.data.trainingId;
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data || [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load departments'
        });
      }
    });
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAll().subscribe({
      next: (response) => {
        this.employees = response.data.map(emp => ({ ...emp, selected: false }));
        this.loadAssignedEmployees();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employees'
        });
        this.isLoading = false;
      }
    });
  }

  private loadAssignedEmployees(): void {
    this.trainingParticipantService.getByTrainingId(this.trainingId).subscribe({
      next: (participants) => {
        if (Array.isArray(participants)) {
          participants.forEach(participant => {
            this.assignedEmployeeIds.add(participant.employee_id);
            const employee = this.employees.find(emp => emp.id === participant.employee_id);
            if (employee) {
              employee.selected = true;
            }
          });
        }
        this.filterEmployees();
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load assigned employees'
        });
        this.isLoading = false;
      }
    });
  }

  onDepartmentChange(): void {
    this.filterEmployees();
  }

  filterEmployees(): void {
    let filtered = [...this.employees];

    // Filter by department
    if (this.selectedDepartment) {
      filtered = filtered.filter(emp => emp.department_id === this.selectedDepartment);
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.first_name.toLowerCase().includes(query) ||
        emp.last_name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
      );
    }

    this.filteredEmployees = filtered;
    this.updateCounts();
  }

  private updateCounts(): void {
    this.selectedCount = this.employees.filter(emp => emp.selected).length;
    this.totalCount = this.employees.length;
  }

  onEmployeeSelect(employee: EmployeeWithSelection): void {
    this.hasChanges = true;
    this.updateCounts();
  }

  isEmployeeAssigned(employeeId: number): boolean {
    return this.assignedEmployeeIds.has(employeeId);
  }

  onSave(): void {
    const selectedEmployees = this.employees.filter(emp => emp.selected).map(emp => emp.id);
    
    this.trainingParticipantService.assignEmployees(this.trainingId, selectedEmployees).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employees assigned successfully'
        });
        this.ref.close(true);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to assign employees'
        });
      }
    });
  }

  onCancel(): void {
    this.ref.close();
  }
} 