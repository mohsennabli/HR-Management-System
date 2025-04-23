import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { Permission, PermissionResponse, PermissionsResponse } from 'src/app/models/permission.model';
import { ApiResponse } from "src/app/models/employee.model";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private endpoint = 'admin/permissions';

  constructor(private api: ApiService) { }

  getPermissions(): Observable<PermissionsResponse> {
    return this.api.get<PermissionsResponse>(this.endpoint);
  }

  getPermission(id: number): Observable<PermissionResponse> {
    return this.api.get<PermissionResponse>(`${this.endpoint}/${id}`);
  }

  createPermission(data: { name: string }): Observable<ApiResponse<Permission>> {
    return this.api.post<ApiResponse<Permission>>(this.endpoint, data);
  }

  updatePermission(id: number, data: { name: string }): Observable<ApiResponse<Permission>> {
    return this.api.put<ApiResponse<Permission>>(`${this.endpoint}/${id}`, data);
  }

  deletePermission(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}