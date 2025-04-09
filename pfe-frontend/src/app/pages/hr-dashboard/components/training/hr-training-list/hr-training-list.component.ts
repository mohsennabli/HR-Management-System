import { Component, OnInit } from '@angular/core';
import { HrTrainingProgramService } from 'src/app/services/hr/training-program.service';

@Component({
  selector: 'app-hr-training-list',
  template: `
    <div class="hr-training-list">
      <div class="page-header">
        <h2>Training Programs</h2>
        <button class="btn-primary" routerLink="create">Add New Training</button>
      </div>
      
      <div class="table-container">
        <table class="training-table text-black bg-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Program Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let training of trainingPrograms">
              <td>{{ training.id }}</td>
              <td>{{ training.name }}</td>
              <td>{{ training.description }}</td>
              <td>{{ training.start_date }}</td>
              <td>{{ training.end_date }}</td>
              <td>{{ training.capacity }}</td>
              <td>
                <span [ngClass]="{
                  'status-badge': true,
                  'upcoming': training.status === 'upcoming',
                  'ongoing': training.status === 'ongoing',
                  'completed': training.status === 'completed'
                }">
                  {{ training.status | titlecase }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-edit" [routerLink]="'edit/' + training.id">Edit</button>
                <button class="btn-delete" (click)="deleteTraining(training.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .hr-training-list {
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .page-header h2 {
      margin: 0;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary:hover {
      background-color: #2980b9;
    }
    .table-container {
      overflow-x: auto;
    }
    .training-table {
      width: 100%;
      border-collapse: collapse;
    }
    .training-table th, .training-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .training-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .training-table tr:hover {
      background-color: #f5f5f5;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge.upcoming {
      background-color: #3498db;
      color: #fff;
    }
    .status-badge.ongoing {
      background-color: #f1c40f;
      color: #fff;
    }
    .status-badge.completed {
      background-color: #2ecc71;
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn-edit, .btn-delete, .btn-view {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .btn-edit {
      background-color: #2ecc71;
      color: white;
    }
    .btn-edit:hover {
      background-color: #27ae60;
    }
    .btn-delete {
      background-color: #e74c3c;
      color: white;
    }
    .btn-delete:hover {
      background-color: #c0392b;
    }
    .btn-view {
      background-color: #3498db;
      color: white;
    }
    .btn-view:hover {
      background-color: #2980b9;
    }
  `]
})
export class HrTrainingListComponent implements OnInit {
  trainingPrograms: any[] = [];

  constructor(private trainingService: HrTrainingProgramService) {}

  ngOnInit(): void {
    this.fetchTrainings();
  }

  fetchTrainings(): void {
    this.trainingService.getAll().subscribe({
      next: (data) => {
        // Ensure that data is an array before assigning it
        if (Array.isArray(data)) {
          this.trainingPrograms = data;
        } else {
          console.error('Training data is not an array:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching training programs:', err);
      }
    });
  }

  deleteTraining(id: number): void {
    if (confirm('Are you sure you want to delete this training?')) {
      this.trainingService.delete(id).subscribe({
        next: () => {
          this.trainingPrograms = this.trainingPrograms.filter(t => t.id !== id);
        },
        error: (err) => {
          console.error('Error deleting training:', err);
        }
      });
    }
  }
}
