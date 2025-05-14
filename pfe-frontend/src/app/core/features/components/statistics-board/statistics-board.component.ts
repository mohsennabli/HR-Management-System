import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-board',
  templateUrl: './statistics-board.component.html',
  styleUrls: ['./statistics-board.component.scss']
})
export class StatisticsBoardComponent {
  // You can later populate these with real data from your backend
 employeeChartData = {
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      data: [150, 30],
      backgroundColor: ['#3B82F6', '#E5E7EB'],
    },
  ],
};

leaveChartData = {
  labels: ['Pending', 'Approved', 'Rejected'],
  datasets: [
    {
      data: [12, 20, 5],
      backgroundColor: ['#F59E0B', '#10B981', '#EF4444'],
    },
  ],
};

chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#4B5563',
      },
    },
  },
};
miniChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: '50%', // for doughnut to make it thinner
};
}