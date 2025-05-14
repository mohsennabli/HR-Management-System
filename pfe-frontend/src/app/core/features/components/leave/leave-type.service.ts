import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { map, Observable } from 'rxjs';
import { LeaveType } from 'src/app/models/leave-type.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private endpoint = 'leave-types';

  constructor(private api: ApiService) { }

  getAll(): Observable<LeaveType[]> {
  return this.api.get(this.endpoint).pipe(
    map((res: any) =>
      res.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        daysAllowed: item.days_allowed,
        isPaid: item.is_paid,
        carryOver: item.carry_over,
        maxCarryOver: item.max_carry_over
      }))
    )
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
} 