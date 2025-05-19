import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-training-view',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ training.name }}</h2>
        <span class="status-badge px-3 py-1 rounded-full text-sm font-medium" [ngClass]="{
          'bg-green-100 text-green-800': training.status === 'ongoing',
          'bg-yellow-100 text-yellow-800': training.status === 'upcoming',
          'bg-gray-100 text-gray-800': training.status === 'completed'
        }">
          {{ training.status | titlecase }}
        </span>
      </div>

      <!-- Description -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Description</h3>
        <p class="text-gray-600">{{ training.description }}</p>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Dates -->
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Schedule</h3>
            <div class="space-y-2">
              <div class="flex items-center text-gray-600">
                <i class="pi pi-calendar mr-2"></i>
                <span>Start: {{ training.start_date | date:'mediumDate' }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-calendar mr-2"></i>
                <span>End: {{ training.end_date | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <!-- Capacity -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Capacity</h3>
            <div class="flex items-center text-gray-600">
              <i class="pi pi-users mr-2"></i>
              <span>{{ training.capacity }} participants</span>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div *ngIf="training.location">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Location</h3>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-map-marker mr-2"></i>
            <span>{{ training.location }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <button pButton type="button" 
                label="Close" 
                icon="pi pi-times" 
                class="p-button-text"
                (click)="ref.close()">
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-button {
        min-width: 100px;
      }
    }
  `]
})
export class TrainingViewComponent implements OnInit {
  training: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.training = this.config.data.training;
  }
} 