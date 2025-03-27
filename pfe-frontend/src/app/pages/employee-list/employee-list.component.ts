import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  users: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe(
      (response: any) => {
        this.users = response.data;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: number | undefined): void {
    if (id === undefined) {
      console.error('User ID is undefined');
      return;
    }
  
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(id).subscribe(
        () => {
          // Remove the deleted user from the list
          this.users = this.users.filter(user => user.id !== id);
          alert('User deleted successfully!');
        },
        (error: any) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      );
    }
  }
}