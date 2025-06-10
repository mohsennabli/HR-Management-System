import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from 'src/app/models/attendance.model';
import { WorkHours } from 'src/app/models/workhours.model';

export interface UpdateAttendanceResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) { }

  /**
   * Fetch today's attendance records, optionally filtered by date and/or user ID.
   */
  getTodayAttendances(date?: string, userId?: string): Observable<{ success: boolean, logOfToday: Attendance[] }> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    if (userId) {
      params = params.set('idUser', userId);
    }
    return this.http.get<{ success: boolean, logOfToday: Attendance[] }>(
      `${this.apiUrl}/GetAllAttendance`,
      { params }
    );
  }

  /**
   * Retrieve raw device data from the biometric device.
   */
  getDeviceData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/zk-data`);
  }

  /**
   * Synchronize attendance data from the device
   */
  synchroniseAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AsynchroniseAttendance`);
  }

  /**
   * Fetch work hours summaries, optionally filtered by date and/or user ID.
   * API returns a two-dimensional array: an array containing the weekly summaries.
   */
  getWorkHours(date?: string, userId?: string): Observable<{ success: boolean, logOfToday: WorkHours[][] }> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    if (userId) {
      params = params.set('idUser', userId);
    }
    // Biometric device connection parameters
    params = params.set('ip', '192.168.121.210');
    params = params.set('port', '4370');

    return this.http.get<{ success: boolean, logOfToday: WorkHours[][] }>(
      `${this.apiUrl}/GetWorkHours`,
      { params }
    );
  }

  /**
   * Update the type of an attendance record
   */
  updateAttendanceType(uid: number, type: number): Observable<UpdateAttendanceResponse> {
    return this.http.put<UpdateAttendanceResponse>(
      `${this.apiUrl}/updateAttendanceType`,
      { uid, type }
    );
  }
}
