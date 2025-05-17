import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8000/api/departments';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getDepartment(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createDepartment(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateDepartment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
