import { Component, OnInit } from '@angular/core';
import { HrDisciplineService } from 'src/app/core/features/components/discipline/discipline.service';
import { DepartmentService } from 'src/app/core/features/components/department/department.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { EmployeeService } from 'src/app/core/features/components/employee/employee.service';
import { Employee, DisciplinaryAction } from 'src/app/models/discipline.model';

interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DisciplineListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: Department[] = [];
  selectedDepartment: number | null = null;
  searchQuery: string = '';
  disciplinaryActions: DisciplinaryAction[] = [];
  showAddActionPanel = false;
  showViewActionsPanel = false;
  selectedEmployee: Employee | null = null;
  selectedEmployeeActions: DisciplinaryAction[] = [];
  newAction: any = {};
  currentUserRole: number = 0;
  currentEmployeeId: number = 0;
  isLoading: boolean = false;

  constructor(
    private disciplineService: HrDisciplineService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.currentUserRole = userData.role_id || userData.role?.id || userData.role || 0;
      this.currentEmployeeId = userData.employee_id || userData.employee?.id || 0;
    }

    this.authService.getLoggedInUser().subscribe({
      next: (userData) => {
        if (userData) {
          this.currentUserRole = userData.role_id || userData.role?.id || userData.role || 0;
          this.currentEmployeeId = userData.employee_id || userData.employee?.id || 0;
          this.loadData();
        }
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user information.' });
      }
    });
  }

  isAdmin(): boolean {
    return this.currentUserRole === 1;
  }

  isHR(): boolean {
    return this.currentUserRole === 3;
  }

  isEmployee(): boolean {
    return this.currentUserRole === 2;
  }

  canViewAllActions(): boolean {
    return this.isAdmin() || this.isHR();
  }

  canCreateAction(): boolean {
    return this.isAdmin() || this.isHR();
  }

  canDeleteAction(action: DisciplinaryAction): boolean {
    if (this.isAdmin() || this.isHR()) {
      return true;
    }
    if (this.isEmployee()) {
      return action.employee_id === this.currentEmployeeId;
    }
    return false;
  }

  loadData(): void {
    this.isLoading = true;
    
    if (this.canViewAllActions()) {
      this.loadEmployees();
    } else {
      this.loadEmployeeActions();
    }
  }

  loadEmployees(): void {
    const params: any = {};
    if (this.selectedDepartment) {
      params.department_id = this.selectedDepartment;
    }
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    console.log('Loading employees with params:', params);
    console.log('Selected Department:', this.selectedDepartment);

    this.employeeService.getAll(params).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.employees = response.data;
        this.filteredEmployees = response.data;
        
        // Debug employee data
        console.log('First employee data:', this.employees[0]);
        console.log('Employee department:', this.employees[0]?.department);
        console.log('Employee department_id:', this.employees[0]?.department_id);
        
        this.loadDepartments();
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employees.' });
        this.isLoading = false;
      }
    });
  }

  loadDepartments(): void {
    console.log('Loading departments...');
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        console.log('Departments Response:', response);
        this.departments = response.data || [];
        console.log('Departments:', this.departments);
        
        // Map departments to employees
        this.employees = this.employees.map(emp => ({
          ...emp,
          department: this.departments.find(dept => dept.id === emp.department_id)
        }));
        this.filteredEmployees = this.employees;
        
        console.log('Employees after department mapping:', this.employees);
        this.loadAllActions();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load departments'
        });
        this.loadAllActions();
      }
    });
  }

  loadAllActions(): void {
    this.disciplineService.getAllActions().subscribe({
      next: (actions) => {
        this.disciplinaryActions = actions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading actions:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load disciplinary actions.' });
        this.isLoading = false;
      }
    });
  }

  loadEmployeeActions(): void {
    this.disciplineService.getAllActions().subscribe({
      next: (actions) => {
        this.disciplinaryActions = actions.filter((action: DisciplinaryAction) => action.employee_id === this.currentEmployeeId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading actions:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load disciplinary actions.' });
        this.isLoading = false;
      }
    });
  }

  onDepartmentChange(): void {
    console.log('Department changed to:', this.selectedDepartment);
    if (this.selectedDepartment) {
      this.selectedDepartment = Number(this.selectedDepartment);
    }
    this.loadEmployees();
  }

  filterEmployees(): void {
    console.log('Filtering employees with query:', this.searchQuery);
    this.loadEmployees();
  }

  openAddActionPanel(employee: Employee): void {
    if (!this.canCreateAction()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to create disciplinary actions.' });
      return;
    }

    this.selectedEmployee = employee;
    this.newAction = {
      employee_id: employee.id,
      action_date: new Date().toISOString().split('T')[0]
    };
    this.showAddActionPanel = true;
  }

  openViewActionsPanel(employee: Employee): void {
    this.selectedEmployee = employee;
    this.selectedEmployeeActions = this.disciplinaryActions.filter(action => action.employee_id === employee.id);
    this.showViewActionsPanel = true;
  }

  closeAddActionPanel(): void {
    this.showAddActionPanel = false;
    this.selectedEmployee = null;
    this.newAction = {};
  }

  closeViewActionsPanel(): void {
    this.showViewActionsPanel = false;
    this.selectedEmployee = null;
    this.selectedEmployeeActions = [];
  }

  submitDiscipline(): void {
    if (!this.canCreateAction()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to create disciplinary actions.' });
      return;
    }

    this.disciplineService.createAction(this.newAction).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Disciplinary action created successfully.' });
        this.loadData();
        this.closeAddActionPanel();
      },
      error: (err) => {
        console.error('Error creating action:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create disciplinary action.' });
      }
    });
  }

  deleteAction(actionId: number | undefined): void {
    if (!actionId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid action ID.' });
      return;
    }

    const action = this.disciplinaryActions.find(a => a.id === actionId);
    if (!action || !this.canDeleteAction(action)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to delete this action.' });
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this disciplinary action?',
      accept: () => {
        this.disciplineService.deleteAction(actionId).subscribe({
          next: () => {
            this.disciplinaryActions = this.disciplinaryActions.filter(a => a.id !== actionId);
            this.selectedEmployeeActions = this.selectedEmployeeActions.filter(a => a.id !== actionId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Disciplinary action deleted successfully.' });
          },
          error: (err) => {
            console.error('Error deleting action:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete disciplinary action.' });
          }
        });
      }
    });
  }

  getActionTypeClass(type: string): string {
    switch (type) {
      case 'verbal_warning':
        return 'bg-blue-500 text-white';
      case 'written_warning':
        return 'bg-yellow-400 text-gray-800';
      case 'suspension':
        return 'bg-red-600 text-white';
      case 'termination':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
}