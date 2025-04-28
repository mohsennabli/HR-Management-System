import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-board',
  templateUrl: './statistics-board.component.html',
  styleUrls: ['./statistics-board.component.scss']
})
export class StatisticsBoardComponent {
  // You can later populate these with real data from your backend
  statistics = {
    totalEmployees: 0,
    departments: 0,
    leaveRequests: 0,
    trainingPrograms: 0
  };
}