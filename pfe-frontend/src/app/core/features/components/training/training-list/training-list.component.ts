import { Component, OnInit } from '@angular/core';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TrainingEmployeeAssignComponent } from '../training-employee-assign/training-employee-assign.component';

export interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: number;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class TrainingListComponent implements OnInit {
  trainingPrograms: TrainingProgram[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private trainingService: TrainingProgramService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.fetchTrainings();
  }

  fetchTrainings(): void {
    this.trainingService.getAll().subscribe({
      next: (data) => {
        this.trainingPrograms = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load training programs.' });
      }
    });
  }

  confirmDelete(training: TrainingProgram): void {
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
