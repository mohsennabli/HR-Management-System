import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract, SIVPContract, MedysisContract } from './contract.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `${environment.apiUrl}/contracts`;

  constructor(private http: HttpClient) { }

  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  createSIVPContract(contract: SIVPContract): Observable<SIVPContract> {
    return this.http.post<SIVPContract>(`${this.apiUrl}/sivp`, contract);
  }

  createMedysisContract(contract: MedysisContract): Observable<MedysisContract> {
    return this.http.post<MedysisContract>(`${this.apiUrl}/medysis`, contract);
  }

  updateContract(id: number, contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${id}`, contract);
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEmployeeContracts(employeeId: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/employee/${employeeId}`);
  }
} 