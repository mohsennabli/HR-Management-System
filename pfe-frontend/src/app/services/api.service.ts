import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }

  getPerformanceMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/performance`);
  }

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users`);
  }

  // Get a single user
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users/${id}`);
  }

  // Create a user
  createUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users`, user);
  }

  // Update a user
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${id}`, user);
  }

  // Delete a user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${id}`);
  }
}
