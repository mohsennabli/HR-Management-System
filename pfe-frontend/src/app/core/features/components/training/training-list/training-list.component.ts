import { Component, OnInit } from '@angular/core';
import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-training-list',
  template: `
    <div class="training-grid-container">
      <div class="header-section">
        <h2>Training Programs</h2>
        <button class="create-button" routerLink="create">
          <i class="fas fa-plus"></i> New Program
        </button>
      </div>

      <div class="grid-container">
        <div *ngFor="let training of trainingPrograms" class="training-card">
          <div class="card-header">
            <h3>{{ training.name | titlecase }}</h3>
            <span class="status-badge" [ngClass]="training.status">
              {{ training.status | titlecase }}
            </span>
          </div>
          
          <div class="card-body">
            <p class="description">{{ training.description }}</p>
            
            <div class="details-grid">
              <div class="detail-item">
                <i class="fas fa-calendar-start"></i>
                <span>{{ training.start_date | date: 'mediumDate' }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar-end"></i>
                <span>{{ training.end_date | date: 'mediumDate' }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-users"></i>
                <span>{{ training.capacity }} Participants</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ training.location || 'TBD' }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button class="action-button edit" [routerLink]="'edit/' + training.id">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-button delete" (click)="deleteTraining(training.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .training-grid-container {
      padding: 2rem;
      background-color: #f5f7fa;
      min-height: 100vh;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    h2 {
      color: #2d3436;
      margin: 0;
      font-size: 1.8rem;
    }

    .create-button {
      background: #4a90e2;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .create-button:hover {
      background: #357abd;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 0 1rem;
    }

    .training-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .training-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .card-header {
      padding: 1.2rem;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      color: #2d3436;
      font-size: 1.1rem;
      max-width: 70%;
    }

    .status-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.upcoming {
      background: #ffe08a;
      color: #946c00;
    }

    .status-badge.ongoing {
      background: #90e0c5;
      color: #005a3c;
    }

    .status-badge.completed {
      background: #b5b5b5;
      color: #3d3d3d;
    }

    .card-body {
      padding: 1.2rem;
      flex-grow: 1;
    }

    .description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1.2rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #444;
    }

    .detail-item i {
      color: #4a90e2;
      width: 1.2rem;
      text-align: center;
    }

    .card-footer {
      padding: 1.2rem;
      background: #f8f9fa;
      border-top: 1px solid #eee;
      display: flex;
      gap: 0.8rem;
    }

    .action-button {
      flex: 1;
      padding: 0.6rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      transition: opacity 0.2s;
    }

    .action-button:hover {
      opacity: 0.9;
    }

    .edit {
      background: #4a90e2;
      color: white;
    }

    .delete {
      background: #e74c3c;
      color: white;
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
      
      .header-section {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `],
  providers: [DatePipe]
})
export class TrainingListComponent implements OnInit {
  trainingPrograms: any[] = [];

  constructor(
    private trainingService: TrainingProgramService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchTrainings();
  }

  fetchTrainings(): void {
    this.trainingService.getAll().subscribe({
      next: (data) => {
        this.trainingPrograms = Array.isArray(data) ? data : [];
        // Add fallback location if missing
        this.trainingPrograms = this.trainingPrograms.map(t => ({
          ...t,
          location: t.location || 'TBD'
        }));
      },
      error: (err) => {
        console.error('Error fetching training programs:', err);
      }
    });
  }

  deleteTraining(id: number): void {
    if (confirm('Are you sure you want to delete this training program?')) {
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