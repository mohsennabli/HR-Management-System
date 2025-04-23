import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { Employee, ApiResponse } from 'src/app/models/employee.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private endpointPrefix = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    // Determine endpoint based on current route
    this.endpointPrefix = this.router.url.includes('/hr/') ? 'hr' : 'admin';

  }
  

  private getFullEndpoint(path: string): string {
    return `${this.endpointPrefix}/employees${path}`;
  }

  getAll(params?: any): Observable<any> {
    return this.api.get(this.getFullEndpoint(''), params);
}

  getById(id: number): Observable<any> {
    return this.api.get(this.getFullEndpoint(`/${id}`));
  }

  create(data: any): Observable<any> {
    return this.api.post(this.getFullEndpoint(''), data);
  }

  update(id: number, data: any): Observable<any> {
    return this.api.put(this.getFullEndpoint(`/${id}`), data);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(this.getFullEndpoint(`/${id}`));
  }
}