import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.access_token) {
            this.storeToken(res.access_token);
            this.storeUser(res.user);
          }
        })
      );
  }

  register(name: string, email: string, password: string, role_id: number) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { name, email, password, role_id })
      .pipe(
        tap(res => {
          this.storeToken(res.access_token);
          this.storeUser(res.user);
        })
      );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return of(null);
    }

    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.clearStorage();
        this.router.navigate(['/login']);
      })
    );
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.storeUser(user);
      })
    );
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
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  getUserRole(): number {
    const user = this.getUser();
    if (!user) return 0;
    
    // Try different possible role field names
    return user.role_id || user.role?.id || user.role || 0;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const expirationDate = decoded.exp * 1000;
      return Date.now() < expirationDate;
    } catch (error) {
      this.clearStorage();
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getLoggedInUser(): Observable<any> {
    if (this.isAuthenticated()) {
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

  resetPassword(email: string): Observable<{ message: string; email_status: { sent: boolean; email: string } }> {
    return this.http.post<{ message: string; email_status: { sent: boolean; email: string } }>(
      `${this.apiUrl}/reset-password`,
      { email }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
