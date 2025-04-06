import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-app-performance',
  templateUrl: './app-performance.component.html',
  styleUrls: ['./app-performance.component.scss']
})
export class AppPerformanceComponent implements OnInit, OnDestroy {
  performanceData: any;
  loading = true;
  error: string | null = null;
  private refreshSubscription: Subscription;

  // Chart instances
  userActivityChart: any;
  apiUsageChart: any;
  responseTimeChart: any;

  constructor(private apiService: ApiService) {
    // Refresh data every 5 minutes
    this.refreshSubscription = interval(300000).subscribe(() => {
      this.loadPerformanceData();
    });
  }

  ngOnInit(): void {
    this.loadPerformanceData();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    // Destroy charts to prevent memory leaks
    if (this.userActivityChart) this.userActivityChart.destroy();
    if (this.apiUsageChart) this.apiUsageChart.destroy();
    if (this.responseTimeChart) this.responseTimeChart.destroy();
  }

  loadPerformanceData(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getPerformanceMetrics().subscribe({
      next: (data: any) => {
        this.performanceData = data;
        this.loading = false;
        this.createCharts();
      },
      error: (err: any) => {
        this.error = 'Failed to load performance data. Please try again later.';
        this.loading = false;
        console.error('Performance data error:', err);
      }
    });
  }

  createCharts(): void {
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        }
      }
    };

    // User Activity Chart (Line Chart)
    this.userActivityChart = new Chart('userActivityChart', {
      type: 'line',
      data: {
        labels: this.performanceData.user_activity.labels,
        datasets: [{
          label: 'Active Users',
          data: this.performanceData.user_activity.data,
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Users'
            }
          }
        }
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
          backgroundColor: '#1cc88a',
          borderRadius: 4
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of API Calls'
            }
          }
        }
      }
    });

    // Response Time Chart (Line Chart)
    this.responseTimeChart = new Chart('responseTimeChart', {
      type: 'line',
      data: {
        labels: this.performanceData.user_activity.labels, // Using same time range
        datasets: [{
          label: 'Response Time (ms)',
          data: Array(7).fill(this.performanceData.avg_response_time), // Using average for now
          borderColor: '#f6c23e',
          backgroundColor: 'rgba(246, 194, 62, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Response Time (ms)'
            }
          }
        }
      }
    });
  }
}