import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface EmployeeStats {
  total: number;
  byType: {
    fullTime: number;
    partTime: number;
    contract: number;
  };
}

export interface AttendanceStats {
  today: number;
  thisMonth: number;
}

export interface TrainingStats {
  total: number;
  active: number;
  thisMonth: number;
}

export interface DisciplinaryStats {
  total: number;
  thisMonth: number;
}

export interface DepartmentStat {
  name: string;
  count: number;
}

export interface AttendanceTrend {
  month: string;
  count: number;
}

export interface AllStatistics {
  employeeStats: EmployeeStats;
  attendanceStats: AttendanceStats;
  trainingStats: TrainingStats;
  disciplinaryStats: DisciplinaryStats;
  departmentStats: DepartmentStat[];
  attendanceTrend: AttendanceTrend[];
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  getAllStatistics(): Observable<AllStatistics> {
    return this.http.get<AllStatistics>(`${this.apiUrl}/all`);
  }

  getEmployeeStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`);
  }

  getLeaveStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaves`);
  }

  getDepartmentStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
  }

  getDisciplinaryStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/disciplinary`);
  }

  getAttendanceStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance`);
  }

  getTrainingStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/training`);
  }
} 