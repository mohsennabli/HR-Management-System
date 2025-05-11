import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private api: ApiService) { }

  getUsers(): Observable<any> {
    return this.api.get(this.endpoint);
  }

  getUser(id: number): Observable<any> {
    return this.api.get(`${this.endpoint}/${id}`);
  }

  createUser(user: User): Observable<any> {
    console.log('Creating user with data:', user); // Debug log
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
      role_id: user.role_id
    };
    console.log('Sending to API:', userData); // Debug log
    return this.api.post(this.endpoint, userData);
  }

  updateUser(id: number, user: User): Observable<any> {
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
      role_id: user.role_id
    };
    return this.api.put(`${this.endpoint}/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}