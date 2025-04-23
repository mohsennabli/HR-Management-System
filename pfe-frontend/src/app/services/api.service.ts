import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Generic GET request
   * @param endpoint - API endpoint (e.g., 'admin/users')
   * @param params - Query parameters (optional)
   * @param headers - Custom headers (optional)
   */
  get<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    const httpHeaders = new HttpHeaders(headers);

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      params: httpParams,
      headers: httpHeaders
    });
  }

  /**
   * Generic POST request
   * @param endpoint - API endpoint
   * @param body - Request payload
   * @param headers - Custom headers (optional)
   */
  post<T>(endpoint: string, body: any, headers?: Record<string, string>): Observable<T> {
    const httpHeaders = new HttpHeaders(headers);

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: httpHeaders
    });
  }

  /**
   * Generic PUT request
   * @param endpoint - API endpoint
   * @param body - Request payload
   * @param headers - Custom headers (optional)
   */
  put<T>(endpoint: string, body: any, headers?: Record<string, string>): Observable<T> {
    const httpHeaders = new HttpHeaders(headers);

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: httpHeaders
    });
  }

  /**
   * Generic PATCH request
   * @param endpoint - API endpoint
   * @param body - Partial request payload
   * @param headers - Custom headers (optional)
   */
  patch<T>(endpoint: string, body: any, headers?: Record<string, string>): Observable<T> {
    const httpHeaders = new HttpHeaders(headers);

    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: httpHeaders
    });
  }

  /**
   * Generic DELETE request
   * @param endpoint - API endpoint
   * @param headers - Custom headers (optional)
   */
  delete<T>(endpoint: string, headers?: Record<string, string>): Observable<T> {
    const httpHeaders = new HttpHeaders(headers);

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
      headers: httpHeaders
    });
  }

  /**
   * Generic file upload
   * @param endpoint - API endpoint
   * @param file - File to upload
   * @param fieldName - Form field name (default: 'file')
   */
  uploadFile<T>(endpoint: string, file: File, fieldName = 'file'): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' })
    });
  }
}