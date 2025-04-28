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
    return this.api.post(this.endpoint, {
      name: user.name,
      email: user.email,
      password: user.password,
      roles: user.roles // Send array of role IDs
    });
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.api.put(`${this.endpoint}/${id}`, {
      name: user.name,
      email: user.email,
      password: user.password,
      roles: user.roles 
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}