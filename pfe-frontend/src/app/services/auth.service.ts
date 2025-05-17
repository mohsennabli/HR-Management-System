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
        tap(res => {
          this.storeToken(res.access_token);
          this.storeUser(res.user);  // store user info (including role)
        })
      );
  }

  register(name: string, email: string, password: string, role_id: number) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { name, email, password, role_id })
      .pipe(
        tap(res => {
          this.storeToken(res.access_token);
          this.storeUser(res.user);  // store user info (including role)
        })
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

  private storeUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    const expirationDate = decoded.exp * 1000;
    return Date.now() < expirationDate;
  }

  getLoggedInUser(): Observable<any> {
    if (this.isLoggedIn()) {
      return this.me();
    } else {
      throw new Error('User not logged in');
    }
  }

  private clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
