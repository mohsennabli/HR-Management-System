import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-app-performance',
  templateUrl: './app-performance.component.html',
  styleUrls: ['./app-performance.component.scss']
})
export class AppPerformanceComponent implements OnInit {
  performanceData: any;
  loading = true;
  error: string | null = null;

  // Chart instances
  userActivityChart: any;
  apiUsageChart: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadPerformanceData();
  }

  loadPerformanceData(): void {
    this.apiService.getPerformanceMetrics().subscribe({
      next: (data: any) => { // Add type for `data`
        this.performanceData = data;
        this.loading = false;
        this.createCharts();
      },
      error: (err: any) => { // Add type for `err`
        this.error = 'Failed to load performance data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createCharts(): void {
    // User Activity Chart (Line Chart)
    this.userActivityChart = new Chart('userActivityChart', {
      type: 'line',
      data: {
        labels: this.performanceData.user_activity.labels,
        datasets: [{
          label: 'Active Users',
          data: this.performanceData.user_activity.data,
          borderColor: '#4e73df',
          tension: 0.3
        }]
      }
    });

    // API Usage Chart (Bar Chart)
    this.apiUsageChart = new Chart('apiUsageChart', {
      type: 'bar',
      data: {
        labels: this.performanceData.api_usage.labels,
        datasets: [{
          label: 'API Calls',
          data: this.performanceData.api_usage.data,
          backgroundColor: '#1cc88a'
        }]
      }
    });
  }
}