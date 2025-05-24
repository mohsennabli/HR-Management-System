import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistics-board',
  templateUrl: './statistics-board.component.html',
  styleUrls: ['./statistics-board.component.scss'],
  providers: [MessageService]
})
export class StatisticsBoardComponent implements OnInit {
  // Chart data for employees
  employeeChartData: any;
  
  // Chart data for leave requests
  leaveChartData: any;
  
  // Chart data for training programs
  trainingChartData: any;
  
  // Chart data for disciplinary cases
  disciplinaryChartData: any;
  
  // Chart data for departments
  departmentChartData: any;
  
  // Chart data for employee distribution
  employeeDistributionData: any;
  
  // Chart data for attendance trend
  attendanceTrendData: any;
  
  // Enhanced chart options with animations and styling
  enhancedChartOptions: any;
  
  // Options for mini bar charts
  miniBarOptions: any;
  
  // Options for mini line charts
  miniLineOptions: any;
  
  // Options for radar charts
  radarOptions: any;
  
  // Options for bar charts
  barChartOptions: any;
  
  // Options for line charts
  lineChartOptions: any;

  // Loading state
  loading: boolean = true;

  constructor(
    private statisticsService: StatisticsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initChartOptions();
    this.loadStatistics();
  }

  getTotalDisciplinaryCases(): number {
    if (!this.disciplinaryChartData?.datasets[0]?.data) {
      return 0;
    }
    return this.disciplinaryChartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  }

  loadStatistics() {
    this.loading = true;
    this.statisticsService.getOverallStatistics().subscribe({
      next: (data) => {
        this.updateChartData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load statistics data'
        });
        this.loading = false;
      }
    });
  }

  updateChartData(data: any) {
    // Update employee chart data
    this.employeeChartData = {
      labels: ['Full-time', 'Part-time', 'Contract'],
      datasets: [{
        data: [
          data.employees.fullTime || 0,
          data.employees.partTime || 0,
          data.employees.contract || 0
        ],
        backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981'],
        hoverBackgroundColor: ['#2563EB', '#7C3AED', '#059669'],
        borderWidth: 0
      }]
    };

    // Update leave chart data
    this.leaveChartData = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        data: [
          data.leaves.approved || 0,
          data.leaves.pending || 0,
          data.leaves.rejected || 0
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#D97706', '#DC2626'],
        borderWidth: 0
      }]
    };

    // Update training chart data
    this.trainingChartData = {
      labels: data.training.months || [],
      datasets: [{
        label: 'Programs',
        data: data.training.programs || [],
        backgroundColor: '#A855F7',
        borderColor: '#9333EA',
        borderWidth: 0,
        borderRadius: 4
      }]
    };

    // Update disciplinary chart data
    this.disciplinaryChartData = {
      labels: data.disciplines.months || [],
      datasets: [{
        label: 'Cases',
        data: data.disciplines.cases || [],
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#F59E0B',
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#F59E0B'
      }]
    };

    // Update department chart data
    this.departmentChartData = {
      labels: data.departments.names || [],
      datasets: [{
        label: 'Employees',
        data: data.departments.employeeCounts || [],
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#06B6D4',
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#06B6D4'
      }]
    };

    // Update employee distribution data
    this.employeeDistributionData = {
      labels: data.departments.names || [],
      datasets: [{
        label: 'Employees',
        data: data.departments.employeeCounts || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: '#3B82F6',
        borderWidth: 0,
        borderRadius: 6,
        hoverBackgroundColor: '#2563EB'
      }]
    };

    // Update attendance trend data
    this.attendanceTrendData = {
      labels: data.attendance.months || [],
      datasets: [{
        label: 'Attendance Rate',
        data: data.attendance.rates || [],
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10B981',
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10B981'
      }]
    };
  }

  initChartOptions() {
    // Enhanced chart options for pie and doughnut
    this.enhancedChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#64748B',
            font: {
              size: 11
            },
            padding: 10,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4,
          displayColors: true
        }
      },
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };

    // Mini bar chart options
    this.miniBarOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          },
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    // Mini line chart options
    this.miniLineOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          },
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    // Radar chart options
    this.radarOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          },
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(203, 213, 225, 0.3)'
          },
          grid: {
            color: 'rgba(203, 213, 225, 0.3)'
          },
          pointLabels: {
            color: '#64748B',
            font: {
              size: 10
            }
          },
          ticks: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    // Bar chart options
    this.barChartOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(203, 213, 225, 0.3)'
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 11
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    // Line chart options
    this.lineChartOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(203, 213, 225, 0.3)'
          },
          ticks: {
            color: '#64748B',
            font: {
              size: 11
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}