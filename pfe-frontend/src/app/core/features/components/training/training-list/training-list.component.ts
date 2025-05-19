import { Component, OnInit } from '@angular/core';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TrainingEmployeeAssignComponent } from '../training-employee-assign/training-employee-assign.component';
import { AuthService } from 'src/app/services/auth.service';

export interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: number;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  employee_id?: number;
}

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class TrainingListComponent implements OnInit {
  trainingPrograms: TrainingProgram[] = [];
  ref: DynamicDialogRef | undefined;
  currentUserRole: number = 0;
  currentEmployeeId: number = 0;

  constructor(
    private trainingService: TrainingProgramService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.fetchTrainings();
  }

  loadUserInfo(): void {
    this.authService.getLoggedInUser().subscribe({
      next: (userData) => {
        if (userData) {
          this.currentUserRole = userData.role_id;
          this.currentEmployeeId = userData.employee_id;
          // Refresh trainings after getting user info
          this.fetchTrainings();
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user information.' });
      }
    });
  }

  isAdmin(): boolean {
    return this.currentUserRole === 1;
  }

  isHR(): boolean {
    return this.currentUserRole === 2;
  }

  isEmployee(): boolean {
    return this.currentUserRole === 3;
  }

  canViewAllPrograms(): boolean {
    return this.isAdmin() || this.isHR();
  }

  canDeleteProgram(program: TrainingProgram): boolean {
    if (this.isAdmin() || this.isHR()) {
      return true;
    }
    if (this.isEmployee()) {
      return program.employee_id === this.currentEmployeeId && program.status === 'upcoming';
    }
    return false;
  }

  canCreateProgram(): boolean {
    return this.isAdmin() || this.isHR();
  }

  fetchTrainings(): void {
    this.trainingService.getAll().subscribe({
      next: (data) => {
        let programs = Array.isArray(data) ? data : [];
        if (!this.canViewAllPrograms()) {
          // Filter programs for employees to only show their own
          programs = programs.filter(program => program.employee_id === this.currentEmployeeId);
        }
        this.trainingPrograms = programs;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load training programs.' });
      }
    });
  }

  confirmDelete(training: TrainingProgram): void {
    if (!this.canDeleteProgram(training)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to delete this program.' });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the program "${training.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteTraining(training.id)
    });
  }

  deleteTraining(id: number): void {
    const program = this.trainingPrograms.find(p => p.id === id);
    if (!program || !this.canDeleteProgram(program)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to delete this program.' });
      return;
    }

    this.trainingService.delete(id).subscribe({
      next: () => {
        this.trainingPrograms = this.trainingPrograms.filter(t => t.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Training program deleted successfully.' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete training program.' });
      }
    });
  }

  openEmployeeAssignmentDialog(training: TrainingProgram): void {
    this.ref = this.dialogService.open(TrainingEmployeeAssignComponent, {
      header: `Assign Employees - ${training.name}`,
      width: '600px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        trainingId: training.id
      }
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.fetchTrainings();
      }
    });
  }
}
