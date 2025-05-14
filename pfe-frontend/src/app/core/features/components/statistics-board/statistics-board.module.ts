import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatisticsBoardComponent } from './statistics-board.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    StatisticsBoardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: StatisticsBoardComponent }
    ]),
     CardModule,
    ButtonModule,
    TooltipModule,
    ChartModule,
    ProgressBarModule
  ]
})
export class StatisticsBoardModule { }