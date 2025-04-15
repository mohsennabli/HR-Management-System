import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { Employee,ApiResponse } from 'src/app/models/employee.model';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private endpoint = 'hr/employees';

  constructor(private api: ApiService) { }

  getAll(): Observable<any> {
    return this.api.get(this.endpoint);
  }

  getById(id: number): Observable<any> {
    return this.api.get(`${this.endpoint}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.api.post(this.endpoint, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.api.put(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
} 