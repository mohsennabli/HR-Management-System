import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatisticsBoardComponent } from './statistics-board.component';

@NgModule({
  declarations: [
    StatisticsBoardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: StatisticsBoardComponent }
    ])
  ]
})
export class StatisticsBoardModule { }