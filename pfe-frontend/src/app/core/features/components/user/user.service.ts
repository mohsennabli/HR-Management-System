import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'admin/users'; // Matches Laravel API route

  constructor(private api: ApiService) { }

  getUsers(): Observable<any> {
    return this.api.get(this.endpoint);
  }

  getUser(id: number): Observable<any> {
    return this.api.get(`${this.endpoint}/${id}`);
  }

  createUser(user: User): Observable<any> {
    return this.api.post(this.endpoint, user);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.api.put(`${this.endpoint}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}