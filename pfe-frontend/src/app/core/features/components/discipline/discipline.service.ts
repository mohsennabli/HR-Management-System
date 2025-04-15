// src/app/services/hr/discipline.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HrDisciplineService {
  private endpoint = 'hr/discipline'; 

  constructor(private api: ApiService) { }

  getAllActions(): Observable<any> {
    return this.api.get(this.endpoint + '/actions').pipe(
      map((res: any) => res.data)
    );
  }

  getEmployees(): Observable<any> {
    return this.api.get(this.endpoint + '/employees').pipe(
      map((res: any) => res.data)
    );
  }

  createAction(data: any): Observable<any> {
    return this.api.post(this.endpoint + '/actions', data).pipe(
      map((res: any) => res.data)
    );
  }
}