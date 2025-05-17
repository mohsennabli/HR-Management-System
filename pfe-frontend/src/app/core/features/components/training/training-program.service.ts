import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {
  private endpoint = 'training-programs';

  constructor(private api: ApiService) { }

  getAll(): Observable<any> {
    return this.api.get(this.endpoint).pipe(
      map((res: any) => res.data) // Extract the data array from the response
    );
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

  getAvailableEmployees(program: { start_date: string; end_date: string }): Observable<any[]> {
    return this.api.post<{data: any[]}>(`${this.endpoint}/available-employees`, program).pipe(
      map(response => response.data)
    );
  }
} 