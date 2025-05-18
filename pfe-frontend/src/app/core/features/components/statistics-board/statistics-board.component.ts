import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-board',
  templateUrl: './statistics-board.component.html',
  styleUrls: ['./statistics-board.component.scss']
})
export class StatisticsBoardComponent {
  // You can later populate these with real data from your backend
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

  constructor() { }

  ngOnInit(): void {
    this.initChartData();
    this.initChartOptions();
  }

  initChartData() {
    // Employee chart data
    this.employeeChartData = {
      labels: ['Full-time', 'Part-time', 'Contract'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981'],
          hoverBackgroundColor: ['#2563EB', '#7C3AED', '#059669'],
          borderWidth: 0
        }
      ]
    };

    // Leave chart data
    this.leaveChartData = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [
        {
          data: [45, 25, 10],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          hoverBackgroundColor: ['#059669', '#D97706', '#DC2626'],
          borderWidth: 0
        }
      ]
    };

    // Training programs data
    this.trainingChartData = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Programs',
          data: [2, 3, 3],
          backgroundColor: '#A855F7',
          borderColor: '#9333EA',
          borderWidth: 0,
          borderRadius: 4
        }
      ]
    };

    // Disciplinary cases data
    this.disciplinaryChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Cases',
          data: [1, 3, 2, 4, 3, 2],
          fill: true,
          tension: 0.4,
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderColor: '#F59E0B',
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#F59E0B'
        }
      ]
    };

    // Department data
    this.departmentChartData = {
      labels: ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'],
      datasets: [
        {
          label: 'Employees',
          data: [25, 40, 30, 35, 45, 50],
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderColor: '#06B6D4',
          pointBackgroundColor: '#06B6D4',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#06B6D4'
        }
      ]
    };

    // Employee distribution data
    this.employeeDistributionData = {
      labels: ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales', 'R&D', 'Admin'],
      datasets: [
        {
          label: 'Employees',
          data: [25, 40, 30, 35, 45, 50, 20, 15],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3B82F6',
          borderWidth: 0,
          borderRadius: 6,
          hoverBackgroundColor: '#2563EB'
        }
      ]
    };

    // Attendance trend data
    this.attendanceTrendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Attendance Rate',
          data: [92, 93, 95, 94, 96, 95, 97, 96, 94, 95, 93, 95],
          fill: true,
          tension: 0.4,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10B981',
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#10B981'
        }
      ]
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
            display: false
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
            color: '#64748B'
          }
        },
        y: {
          grid: {
            color: 'rgba(203, 213, 225, 0.3)'
          },
          ticks: {
            color: '#64748B'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
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
            color: '#64748B'
          }
        },
        y: {
          grid: {
            color: 'rgba(203, 213, 225, 0.3)'
          },
          ticks: {
            color: '#64748B',
            callback: function(value: any) {
              return value + '%';
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    };
  }
}