import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get overall statistics
  getOverallStatistics(): Observable<any> {
    return forkJoin({
      employees: this.getEmployeeStatistics(),
      leaves: this.getLeaveStatistics(),
      departments: this.getDepartmentStatistics(),
      disciplines: this.getDisciplinaryStatistics(),
      attendance: this.getAttendanceStatistics(),
      training: this.getTrainingStatistics()
    });
  }

  // Get employee statistics
  getEmployeeStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/employees`);
  }

  // Get leave statistics
  getLeaveStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/leaves`);
  }

  // Get department statistics
  getDepartmentStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/departments`);
  }

  // Get disciplinary statistics
  getDisciplinaryStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/disciplinary`);
  }

  // Get attendance statistics
  getAttendanceStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/attendance`);
  }

  // Get training statistics
  getTrainingStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/training`);
  }
} 