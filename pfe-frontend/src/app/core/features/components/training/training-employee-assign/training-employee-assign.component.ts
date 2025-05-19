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
  template: `
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">Assign Employees to Training</h2>
      
      <div class="mb-4 flex gap-4">
        <div class="w-1/3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <p-dropdown
            [options]="departments"
            [(ngModel)]="selectedDepartment"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Department"
            [showClear]="true"
            (onChange)="onDepartmentChange()"
            class="w-full"
          ></p-dropdown>
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Employees</label>
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search"></i>
            <input 
              pInputText 
              type="text" 
              class="w-full p-2 border rounded-lg" 
              placeholder="Search by name or email..." 
              [(ngModel)]="searchQuery"
              (input)="filterEmployees()"
            />
          </span>
        </div>
      </div>

      <div class="employee-list max-h-[400px] overflow-y-auto bg-white rounded-lg border">
        <div *ngIf="isLoading" class="flex justify-center items-center h-32">
          <p-progressSpinner></p-progressSpinner>
        </div>

        <div *ngIf="!isLoading && filteredEmployees.length === 0" class="text-center p-4 text-gray-500">
          No employees found
        </div>

        <div *ngFor="let employee of filteredEmployees" 
             class="employee-item p-3 border-b hover:bg-gray-50 flex items-center justify-between">
          <div class="flex items-center">
            <p-checkbox 
              [binary]="true" 
              [(ngModel)]="employee.selected"
              (onChange)="onEmployeeSelect(employee)"
              [disabled]="isEmployeeAssigned(employee.id)"
            ></p-checkbox>
            <div class="ml-3">
              <div class="font-medium">{{ employee.first_name }} {{ employee.last_name }}</div>
              <div class="text-sm text-gray-500">{{ employee.email }}</div>
              <div class="text-xs text-gray-400">{{ employee.department?.name || 'No Department' }}</div>
            </div>
          </div>
          <div *ngIf="isEmployeeAssigned(employee.id)" class="text-sm text-green-600">
            <i class="pi pi-check-circle mr-1"></i> Assigned
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-600">
          Selected: {{ selectedCount }} / {{ totalCount }} employees
        </div>
        <div class="flex gap-2">
          <p-button 
            label="Cancel" 
            icon="pi pi-times" 
            styleClass="p-button-text" 
            (onClick)="onCancel()"
          ></p-button>
          <p-button 
            label="Save" 
            icon="pi pi-check" 
            (onClick)="onSave()"
            [disabled]="!hasChanges"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-checkbox {
        width: 1.5rem;
        height: 1.5rem;
      }
      .p-checkbox .p-checkbox-box {
        border-radius: 0.25rem;
      }
      .p-dropdown {
        width: 100%;
      }
    }
  `]
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