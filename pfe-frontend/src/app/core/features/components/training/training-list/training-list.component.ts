import { Component, OnInit } from '@angular/core';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { TrainingParticipantService } from '../training-participant.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TrainingEmployeeAssignComponent } from '../training-employee-assign/training-employee-assign.component';
import { TrainingViewComponent } from '../training-view/training-view.component';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

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
  isLoading: boolean = false;

  constructor(
    private trainingService: TrainingProgramService,
    private trainingParticipantService: TrainingParticipantService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.getLoggedInUser().subscribe({
      next: (userData) => {
        if (userData) {
          this.currentUserRole = userData.role_id;
          this.currentEmployeeId = userData.employee_id;
          // Fetch trainings after getting user info
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
    return this.currentUserRole === 3;
  }

  isEmployee(): boolean {
    return this.currentUserRole === 2;
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
    this.isLoading = true;
    
    if (this.isEmployee()) {
      // For employees, fetch all trainings and then filter by their assignments
      this.trainingService.getAll().subscribe({
        next: (allPrograms) => {
          const programs = Array.isArray(allPrograms) ? allPrograms : [];
          
          // Get all training IDs
          const trainingIds = programs.map(program => program.id);
          
          // For each training, check if the employee is assigned
          const assignmentChecks = trainingIds.map(trainingId => 
            this.trainingParticipantService.getByTrainingId(trainingId)
          );
          
          forkJoin(assignmentChecks).subscribe({
            next: (assignments) => {
              // Filter programs where the employee is assigned
              this.trainingPrograms = programs.filter((program, index) => {
                const programAssignments = assignments[index];
                return programAssignments.some(assignment => 
                  assignment.employee_id === this.currentEmployeeId
                );
              });
              this.isLoading = false;
            },
            error: (err) => {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load training assignments.' 
              });
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load training programs.' 
          });
          this.isLoading = false;
        }
      });
    } else {
      // For Admin and HR, fetch all trainings
      this.trainingService.getAll().subscribe({
        next: (data) => {
          this.trainingPrograms = Array.isArray(data) ? data : [];
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load training programs.' 
          });
          this.isLoading = false;
        }
      });
    }
  }

  openViewDialog(training: TrainingProgram): void {
    this.ref = this.dialogService.open(TrainingViewComponent, {
      header: 'Training Details',
      width: '700px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        training: training
      }
    });
  }

  editTraining(training: TrainingProgram): void {
    this.router.navigate(['/dashboard/training/edit', training.id]);
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
