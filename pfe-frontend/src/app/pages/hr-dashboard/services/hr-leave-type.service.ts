import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LeaveType {
  id?: number;
  name: string;
  description: string;
  days_allowed: number;
  is_paid?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HrLeaveTypeService {
  private apiUrl = `${environment.apiUrl}/hr/leave-types`;

  constructor(private http: HttpClient) { }

  getLeaveTypes(): Observable<ApiResponse<LeaveType[]>> {
    return this.http.get<ApiResponse<LeaveType[]>>(this.apiUrl);
  }

  getLeaveType(id: number): Observable<ApiResponse<LeaveType>> {
    return this.http.get<ApiResponse<LeaveType>>(`${this.apiUrl}/${id}`);
  }

  createLeaveType(leaveType: LeaveType): Observable<ApiResponse<LeaveType>> {
    return this.http.post<ApiResponse<LeaveType>>(this.apiUrl, leaveType);
  }

  updateLeaveType(id: number, leaveType: LeaveType): Observable<ApiResponse<LeaveType>> {
    return this.http.put<ApiResponse<LeaveType>>(`${this.apiUrl}/${id}`, leaveType);
  }

  deleteLeaveType(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
} 