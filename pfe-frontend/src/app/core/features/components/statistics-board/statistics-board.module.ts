import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatisticsBoardComponent } from './statistics-board.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { KnobModule } from 'primeng/knob';
import { RippleModule } from 'primeng/ripple';
import { StatisticsService } from './statistics.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    StatisticsBoardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: StatisticsBoardComponent }
    ]),
    CardModule,
    ButtonModule,
    TooltipModule,
    ChartModule,
    ProgressBarModule,
    KnobModule,
    RippleModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  exports: [
    StatisticsBoardComponent
  ],
  providers: [
    StatisticsService
  ]
})
export class StatisticsBoardModule { }