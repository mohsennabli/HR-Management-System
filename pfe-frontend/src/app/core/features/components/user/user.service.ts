import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiResponse } from 'src/app/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private api: ApiService) { }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.api.get<ApiResponse<User[]>>(this.endpoint);
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.api.get<ApiResponse<User>>(`${this.endpoint}/${id}`);
  }

  createUser(user: User): Observable<ApiResponse<User>> {
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
      role_id: user.role_id
    };
    return this.api.post<ApiResponse<User>>(this.endpoint, userData);
  }

  updateUser(id: number, user: User): Observable<ApiResponse<User>> {
    const userData = {
      name: user.name,
      email: user.email,
      role_id: user.role_id
    };
    return this.api.put<ApiResponse<User>>(`${this.endpoint}/${id}`, userData);
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}