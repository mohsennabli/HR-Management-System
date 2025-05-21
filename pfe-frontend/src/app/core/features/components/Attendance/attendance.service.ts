import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from 'src/app/models/attendance.model';
import { WorkHours } from 'src/app/models/workhours.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

   private apiUrl = 'http://localhost:8000/api'; // Remplacez par votre URL API

  constructor(private http: HttpClient) { }

  getTodayAttendances(date?: string, userId?: string): Observable<{success: boolean, logOfToday: Attendance[]}> {
    let params: any = {};
    if (date) params.date = date;
    if (userId) params.idUser = userId;
    
    return this.http.get<{success: boolean, logOfToday: Attendance[]}>(`${this.apiUrl}/GetAllAttendance`, { params });
  }

  getDeviceData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/zk-data`);
  }
 
  getWorkHours(date?: string, userId?: string): Observable<{success: boolean, logOfToday: any}> {
    let params: any = {};
    if (date) params.date = date;
    if (userId) params.idUser = userId;
    params.ip='192.168.121.210';
    params.port=4370
    
    return this.http.get<{success: boolean, logOfToday: any}>(`${this.apiUrl}/GetWorksHour`, { params });
  }
}