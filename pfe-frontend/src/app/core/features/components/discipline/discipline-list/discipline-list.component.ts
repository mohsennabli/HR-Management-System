import { Component, OnInit } from '@angular/core';
import { HrDisciplineService } from 'src/app/core/features/components/discipline/discipline.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

interface DisciplinaryAction {
  id: number;
  employee_id: number;
  type: 'verbal_warning' | 'written_warning' | 'suspension' | 'termination';
  reason: string;
  action_date: string;
  notes?: string;
  employee: {
    first_name: string;
    last_name: string;
  };
}

@Component({
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DisciplineListComponent implements OnInit {
  employees: any[] = [];
  disciplinaryActions: DisciplinaryAction[] = [];
  showForm = false;
  selectedEmployee: any;
  newAction: any = {};
  currentUserRole: number = 0;
  currentEmployeeId: number = 0;

  constructor(
    private disciplineService: HrDisciplineService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    // First try to get role from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      console.log('Complete user data from localStorage:', userData);
      // Try different possible role field names
      this.currentUserRole = userData.role_id || userData.role?.id || userData.role || 0;
      this.currentEmployeeId = userData.employee_id || userData.employee?.id || 0;
      console.log('Parsed role from localStorage:', this.currentUserRole);
    }

    // Then get fresh data from the server
    this.authService.getLoggedInUser().subscribe({
      next: (userData) => {
        if (userData) {
          console.log('Complete user data from server:', userData);
          // Try different possible role field names
          this.currentUserRole = userData.role_id || userData.role?.id || userData.role || 0;
          this.currentEmployeeId = userData.employee_id || userData.employee?.id || 0;
          console.log('Parsed role from server:', this.currentUserRole);
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
    const isAdmin = this.currentUserRole === 1;
    console.log('isAdmin check:', isAdmin, 'current role:', this.currentUserRole);
    return isAdmin;
  }

  isHR(): boolean {
    const isHR = this.currentUserRole === 3;
    console.log('isHR check:', isHR, 'current role:', this.currentUserRole);
    return isHR;
  }

  isEmployee(): boolean {
    const isEmployee = this.currentUserRole === 2;
    console.log('isEmployee check:', isEmployee, 'current role:', this.currentUserRole);
    return isEmployee;
  }

  canViewAllActions(): boolean {
    const canView = this.isAdmin() || this.isHR();
    console.log('canViewAllActions check:', canView, 'isAdmin:', this.isAdmin(), 'isHR:', this.isHR());
    return canView;
  }

  canCreateAction(): boolean {
    const canCreate = this.isAdmin() || this.isHR();
    console.log('canCreateAction check:', canCreate);
    return canCreate;
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
    console.log('Loading data for role:', this.currentUserRole);
    
    // Load employees - only for Admin and HR
    if (this.canViewAllActions()) {
      console.log('Loading employees list...');
      this.disciplineService.getEmployees().subscribe({
        next: (employees) => {
          console.log('Employees loaded:', employees);
          this.employees = employees;
        },
        error: (err) => {
          console.error('Error loading employees:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employees.' });
        }
      });
    }
  
    // Load disciplinary actions
    console.log('Loading disciplinary actions...');
    this.disciplineService.getAllActions().subscribe({
      next: (actions) => {
        console.log('Actions loaded:', actions);
        if (!this.canViewAllActions()) {
          // Filter actions for employees to only show their own
          this.disciplinaryActions = actions.filter((action: DisciplinaryAction) => action.employee_id === this.currentEmployeeId);
        } else {
          this.disciplinaryActions = actions;
        }
        console.log('Filtered actions:', this.disciplinaryActions);
      },
      error: (err) => {
        console.error('Error loading actions:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load disciplinary actions.' });
      }
    });
  }

  openDisciplineForm(employee: any): void {
    if (!this.canCreateAction()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to create disciplinary actions.' });
      return;
    }

    this.selectedEmployee = employee;
    this.newAction = {
      employee_id: employee.id,
      action_date: new Date().toISOString().split('T')[0]
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedEmployee = null;
    this.newAction = {};
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
        this.closeForm();
      },
      error: (err) => {
        console.error('Error creating action:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create disciplinary action.' });
      }
    });
  }

  deleteAction(actionId: number): void {
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
}