import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/models/user.model'; // Updated import path
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-edit', // Updated selector
  templateUrl: './user-edit.component.html', // Updated template URL
  styleUrls: ['./user-edit.component.scss'] // Updated style URL
})
export class UserEditComponent implements OnInit {
  user: User = { 
    name: '', 
    email: '', 
    password: '', 
    roles: [] // Changed from role_id
  };
  selectedRoles: number[] = []; // For form binding
  loading = false;
  error = '';
  loadingUser = false;
availableRoles: any;

  constructor(
    private userService: UserService,
  private route: ActivatedRoute,
  private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedRoles = this.user.roles.map(role => role.id);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadingUser = true;
      this.userService.getUser(+id).subscribe({
        next: (response: any) => {
          this.user = response.data;
          this.loadingUser = false;
        },
        error: (error: any) => {
          this.loadingUser = false;
          if (error.error?.errors) {
            this.error = Object.values(error.error.errors).flat().join(', ');
          } else {
            this.error = 'Failed to load user. Please try again.'; // Updated error message
          }
          console.error('Error fetching user:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.loading || !this.user.id) return;
    
    this.loading = true;
    this.error = '';

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.router.navigate(['/admin/users']); // Updated navigation path
      },
      error: (error: any) => {
        this.loading = false;
        if (error.error?.errors) {
          this.error = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.error = 'Failed to update user. Please try again.'; // Updated error message
        }
        console.error('Error updating user:', error);
      }
    });
  }
}