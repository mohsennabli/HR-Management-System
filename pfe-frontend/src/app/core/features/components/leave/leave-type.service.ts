import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private endpoint = 'leave-types';

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