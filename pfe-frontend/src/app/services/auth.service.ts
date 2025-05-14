import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => this.storeToken(res.access_token))
      );
  }

  register(name: string, email: string, password: string, role_id: number) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { name, email, password, role_id })
      .pipe(
        tap(res => this.storeToken(res.access_token))
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.clearStorage())
      );
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {});
  }

  private storeToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  private clearStorage() {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

   isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Check token expiration
    const decoded = this.decodeToken(token);
    const expirationDate = decoded.exp * 1000;
    return Date.now() < expirationDate;
  }
   getLoggedInUser(): Observable<any> {
    if (this.isLoggedIn()) {
      return this.me();  // Fetch user data if logged in
    } else {
      throw new Error('User not logged in');
    }
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

}