import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingParticipantService {
  private endpoint = 'training-participants';
  private programEndpoint = 'training-programs';
  private apiUrl = `${environment.apiUrl}/training-participants`;

  constructor(private api: ApiService, private http: HttpClient) { }

  getAllForProgram(programId: number): Observable<any> {
    return this.api.get(`${this.programEndpoint}/${programId}/participants`);
  }

  getById(programId: number, participantId: number): Observable<any> {
    return this.api.get(`${this.programEndpoint}/${programId}/participants/${participantId}`);
  }

  create(programId: number, data: any): Observable<any> {
    return this.api.post(`${this.programEndpoint}/${programId}/participants`, {
      employee_id: data.employee_id // Send only employee_id
    });
  }

  update(programId: number, participantId: number, data: any): Observable<any> {
    return this.api.put(`${this.programEndpoint}/${programId}/participants/${participantId}`, data);
  }

  delete(programId: number, participantId: number): Observable<any> {
    return this.api.delete(`${this.programEndpoint}/${programId}/participants/${participantId}`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.api.patch(`${this.endpoint}/${id}/status`, { status });
  }

  getAvailableEmployees(programId: number): Observable<any[]> {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/available-employees/${programId}`).pipe(
      map(response => response.data)
    );
  }

  getByTrainingId(trainingId: number): Observable<any[]> {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/training/${trainingId}`).pipe(
      map(response => response.data)
    );
  }

  assignEmployees(trainingId: number, employeeIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign`, {
      training_id: trainingId,
      employee_ids: employeeIds
    });
  }

  removeEmployee(trainingId: number, employeeId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/training/${trainingId}/employee/${employeeId}`);
  }
} 