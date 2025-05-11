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
      switchMap(response => {
        if (response && Array.isArray(response.data)) {
          // Create an array of observables to fetch permissions for each role
          const rolesWithPermissions$ = response.data.map(role => 
            this.getRole(role.id).pipe(
              map(roleResponse => ({
                ...role,
                permissions: roleResponse.data.permissions || []
              }))
            )
          );

          // Use forkJoin to wait for all permission requests to complete
          return forkJoin(rolesWithPermissions$).pipe(
            map(roles => ({
              name: response.name,
              success: response.success,
              message: response.message,
              data: roles
            }))
          );
        }
        return new Observable<ApiResponse<Role[]>>(subscriber => {
          subscriber.next(response);
          subscriber.complete();
        });
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