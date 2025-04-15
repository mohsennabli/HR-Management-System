import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model'; // Updated import path
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-create', // Updated selector
  templateUrl: './user-create.component.html', // Updated template URL
  styleUrls: ['./user-create.component.scss'] // Updated style URL
})
export class UserCreateComponent {
  user: User = { name: '', email: '', password: '', role_id: 0 };
  loading = false;
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['/admin/users']); // Updated navigation path
      },
      error: (error) => {
        this.loading = false;
        if (error.error?.errors) {
          this.error = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.error = 'Failed to create user. Please try again.'; // Updated error message
        }
        console.error('Error creating user:', error); // Updated log message
      }
    });
  }
}