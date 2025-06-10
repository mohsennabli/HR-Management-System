import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-training-view',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './training-view.component.html',
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