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
              <button class="action-button add-employee" [routerLink]="'edit/' + training.id">
                <i class="fas fa-user-plus"></i> Add Employees
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
  padding: 2.5rem;
  background: linear-gradient(180deg,rgb(11, 81, 187) 0%, #eef1f5 100%);
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding: 0 1.5rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    letter-spacing: -0.025em;
  }
}

.create-button {
  background: linear-gradient(135deg, #2b6cb0, #4299e1);
  color: #fff;
  border: none;
  padding: 0.9rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #2c5282, #2b6cb0);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(66, 153, 225, 0.3);
  }

  i {
    font-size: 1rem;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  padding: 0 1.5rem;
}

.training-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
}

.card-header {
  padding: 1.5rem;
  background:rgb(44, 172, 189);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    max-width: 65%;
    line-height: 1.3;
  }
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.upcoming {
    background: #fefcbf;
    color: #744210;
  }

  &.ongoing {
    background: #b2f5ea;
    color: #2c7a7b;
  }

  &.completed {
    background: #e2e8f0;
    color: #4a5568;
  }
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.description {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-height: 4.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #2d3748;
  font-weight: 500;

  i {
    color: #4299e1;
    width: 1.5rem;
    font-size: 1.1rem;
    text-align: center;
  }

  span {
    flex: 1;
  }
}

.card-footer {
  padding: 1.5rem;
  background: #fafafa;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.edit {
    background: #4299e1;
    color: #fff;

    &:hover {
      background: #2b6cb0;
    }
  }

  &.add-employee {
    background: #48bb78;
    color: #fff;

    &:hover {
      background: #38a169;
    }
  }

  &.delete {
    background: #f56565;
    color: #fff;

    &:hover {
      background: #e53e3e;
    }
  }

  i {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .training-grid-container {
    padding: 1.5rem;
  }

  .grid-container {
    grid-template-columns: 1fr;
    padding: 0;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 0;
  }

  .training-card {
    border-radius: 12px;
  }

  .card-footer {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .card-header h3 {
    font-size: 1.1rem;
    max-width: 60%;
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