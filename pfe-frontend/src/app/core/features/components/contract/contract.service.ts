import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Contract, SIVPContract, MedysisContract } from './contract.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `${environment.apiUrl}/contracts`;

  constructor(private http: HttpClient) { }

  getAllContracts(): Observable<Contract[]> {
    console.log('Fetching all contracts from:', this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('Raw API response:', response);
        if (response && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching contracts:', error);
        return throwError(() => error);
      })
    );
  }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createSIVPContract(contract: SIVPContract): Observable<Contract> {
    const contractData = {
      ...contract,
      contract_type: 'sivp'
    };
    return this.http.post<any>(this.apiUrl, contractData).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('SIVP contract creation error:', error);
        return throwError(() => error);
      })
    );
  }

  createMedysisContract(contract: MedysisContract): Observable<Contract> {
    const contractData = {
      ...contract,
      contract_type: 'medysis',
      start_date: new Date(contract.start_date).toISOString().split('T')[0],
      end_date: new Date(contract.end_date).toISOString().split('T')[0]
    };
    
    return this.http.post<any>(this.apiUrl, contractData).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Medysis contract creation error:', error);
        return throwError(() => error);
      })
    );
  }

  updateContract(id: number, contract: Contract): Observable<Contract> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, contract).pipe(
      map(response => response.data)
    );
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEmployeeContracts(employeeId: number): Observable<Contract[]> {
    return this.http.get<any>(`${this.apiUrl}/employee/${employeeId}`).pipe(
      map(response => response.data || [])
    );
  }
} 