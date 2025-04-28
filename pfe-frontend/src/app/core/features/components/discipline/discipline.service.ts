// src/app/services/hr/discipline.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HrDisciplineService {
  private endpoint = 'disciplinary-actions';
  private employeesEndpoint = 'discipline/employees';

  constructor(private api: ApiService) { }

  getAllActions(): Observable<any> {
    return this.api.get(this.endpoint).pipe(
      map((res: any) => res.data)
    );
  }

  getEmployees(): Observable<any> {
    return this.api.get(this.employeesEndpoint).pipe(
      map((res: any) => res.data)
    );
  }

  createAction(data: any): Observable<any> {
    return this.api.post(this.endpoint, data).pipe(
      map((res: any) => res.data)
    );
  }

  deleteAction(actionId: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${actionId}`).pipe(
      map((res: any) => res.data),
      catchError(error => {
        console.error('API Error:', error);
        throw error; // Re-throw to handle in component
      })
    );
  }
}