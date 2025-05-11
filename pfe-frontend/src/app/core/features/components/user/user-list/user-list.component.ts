import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
  
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        console.log('Users API Response:', response); // Debug log
        if (response.data) {
          this.users = response.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role: user.role // Include the entire role object
          }));
          console.log('Processed Users:', this.users); // Debug log
        } else {
          this.error = 'Unexpected API response';
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Failed to load users. Please try again.';
        console.error('Error fetching users:', error);
      }
    });
  }

  deleteUser(id: number | undefined): void {
    if (!id) {
      this.error = 'Invalid user ID';
      return;
    }
  
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (error: any) => {
          this.error = 'Failed to delete user. Please try again.';
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  getRoleName(user: User): string {
    return user.role?.name || 'No role assigned';
  }
}