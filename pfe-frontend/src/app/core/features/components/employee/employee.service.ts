import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { Employee, ApiResponse } from 'src/app/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private endpoint = 'employees';

  constructor(private api: ApiService) {}

  getAll(params?: any): Observable<ApiResponse<Employee[]>> {
    return this.api.get<ApiResponse<Employee[]>>(this.endpoint, params);
  }

  getById(id: number): Observable<ApiResponse<Employee>> {
    return this.api.get<ApiResponse<Employee>>(`${this.endpoint}/${id}`);
  }

  create(data: any): Observable<ApiResponse<Employee>> {
    return this.api.post<ApiResponse<Employee>>(this.endpoint, data);
  }

  update(id: number, data: any): Observable<ApiResponse<Employee>> {
    return this.api.put<ApiResponse<Employee>>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}