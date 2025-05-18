import { Injectable } from "@angular/core";
import { catchError, Observable, throwError, forkJoin, map, switchMap } from "rxjs";
import { ApiResponse } from "src/app/models/employee.model";
import { Role, RoleResponse} from "src/app/models/role.model";
import { ApiService } from "src/app/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private endpoint = 'roles';

  constructor(private api: ApiService) { }

  getRoles(): Observable<ApiResponse<Role[]>> {
  return this.api.get<ApiResponse<Role[]>>(this.endpoint).pipe(
    map(response => {
      if (response && Array.isArray(response.data)) {
        // Simply return the response as is, without fetching permissions
        return {
          name: response.name,
          success: response.success,
          message: response.message,
          data: response.data
        };
      }
      return response;
    }),
    catchError(error => {
      console.error('Error fetching roles:', error);
      return throwError(() => new Error('Failed to fetch roles'));
    })
  );
}


  getRole(id: number): Observable<RoleResponse> {
    return this.api.get<RoleResponse>(`${this.endpoint}/${id}`);
  }

  createRole(roleData: { name: string, permissions: number[] }): Observable<ApiResponse<Role>> {
    return this.api.post<ApiResponse<Role>>(this.endpoint, roleData);
  }

  updateRole(id: number, roleData: { name: string, permissions: number[] }): Observable<ApiResponse<Role>> {
    return this.api.put<ApiResponse<Role>>(`${this.endpoint}/${id}`, roleData);
  }

  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}