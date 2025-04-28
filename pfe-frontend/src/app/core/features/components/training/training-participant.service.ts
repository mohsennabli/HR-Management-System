import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingParticipantService {
  private endpoint = 'training-participants';
  private programEndpoint = 'training-programs';

  constructor(private api: ApiService) { }

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
} 