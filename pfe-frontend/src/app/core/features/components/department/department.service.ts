import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;

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
