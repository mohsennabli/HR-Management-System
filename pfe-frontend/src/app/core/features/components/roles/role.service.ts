import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
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
      catchError(error => {
        console.error('Error fetching roles:', error);
        throw error;
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