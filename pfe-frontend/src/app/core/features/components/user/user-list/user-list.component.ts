import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model'; // Adjust the import path as necessary
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list', // Updated selector
  templateUrl: './user-list.component.html', // Updated template URL
  styleUrls: ['./user-list.component.scss'] // Updated style URL
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
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
      this.userService.deleteUser(id).subscribe(
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