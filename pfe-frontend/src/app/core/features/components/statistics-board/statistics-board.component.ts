import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService, AllStatistics, AttendanceStats, TrainingStats, DisciplinaryStats, AttendanceTrend } from './statistics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistics-board',
  templateUrl: './statistics-board.component.html',
  styleUrls: ['./statistics-board.component.css']
})
export class StatisticsBoardComponent implements OnInit, OnDestroy {
  statistics: AllStatistics | null = null;
  private subscription: Subscription | null = null;

  // Chart data
  attendanceChartData: any = null;
  departmentChartData: any = null;
  employeeChartData: any = null;

  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Stats properties
  attendanceStats: AttendanceStats | null = null;
  trainingStats: TrainingStats | null = null;
  disciplinaryStats: DisciplinaryStats | null = null;

  loading = false;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadStatistics(): void {
    this.loading = true;
    this.subscription = this.statisticsService.getAllStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.initializeCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
  }

  private initializeCharts(): void {
    if (!this.statistics) return;

    // Ensure attendanceTrend is an array and type it properly
    const attendanceTrend: AttendanceTrend[] = Array.isArray(this.statistics.attendanceTrend) 
      ? this.statistics.attendanceTrend 
      : Object.values(this.statistics.attendanceTrend) as AttendanceTrend[];

    // Initialize Attendance Trend Chart
    this.attendanceChartData = {
      labels: attendanceTrend.map(trend => trend.month),
      datasets: [{
        label: 'Attendance Records',
        data: attendanceTrend.map(trend => trend.count),
        borderColor: '#3B82F6', // Blue color to match the theme
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Light blue with opacity
        tension: 0.4,
        fill: true
      }]
    };

    // Initialize Department Distribution Chart
    this.departmentChartData = {
      labels: this.statistics.departmentStats.map(dept => dept.name),
      datasets: [{
        data: this.statistics.departmentStats.map(dept => dept.count),
        backgroundColor: [
          '#3B82F6', // Blue
          '#60A5FA', // Light Blue
          '#93C5FD', // Lighter Blue
          '#BFDBFE', // Very Light Blue
          '#DBEAFE', // Lightest Blue
          '#EFF6FF'  // White Blue
        ],
        borderWidth: 1
      }]
    };

    // Update employee chart data
    this.employeeChartData = {
      labels: ['Full-time', 'Part-time', 'Contract'],
      datasets: [{
        data: [
          this.statistics.employeeStats.byType.fullTime,
          this.statistics.employeeStats.byType.partTime,
          this.statistics.employeeStats.byType.contract
        ],
        backgroundColor: [
          '#3B82F6', // Blue
          '#60A5FA', // Light Blue
          '#93C5FD'  // Lighter Blue
        ],
        borderWidth: 1
      }]
    };

    // Update stats
    this.attendanceStats = this.statistics.attendanceStats;
    this.trainingStats = this.statistics.trainingStats;
    this.disciplinaryStats = this.statistics.disciplinaryStats;
  }

  refreshStatistics(): void {
    this.loadStatistics();
  }
}