import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private endpoint = 'leave-requests';

  constructor(private api: ApiService,private authService: AuthService) { }

 getAll(): Observable<any> {
  return this.api.get(this.endpoint).pipe(
    map((res: any) => {
      return res?.data || res || [];
    }),
    catchError(this.handleError)
  );
}
  

  getById(id: number): Observable<any> {
    return this.api.get(`${this.endpoint}/${id}`).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  create(data: any): Observable<any> {
    return this.api.post(this.endpoint, data).pipe(
      map((res: any) => res.data || res),
      catchError((error) => {
        console.log('Service error caught:', error);
        console.log('Error structure in service:', JSON.stringify(error, null, 2));
        // Preserve the original error structure
        return throwError(() => error);
      })
    );
  }

  update(id: number, data: any): Observable<any> {
    return this.api.put(`${this.endpoint}/${id}`, data).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.api.patch(`${this.endpoint}/${id}/status`, { status }).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Preserve the original error structure so the component can access err.error.message
    return throwError(() => error);
  }
}
