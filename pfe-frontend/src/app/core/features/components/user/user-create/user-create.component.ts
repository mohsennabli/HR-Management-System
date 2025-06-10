import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  user: User = { 
    name: '', 
    email: '', 
    password: '', 
    role_id: null
  };
  availableRoles: Role[] = [];
  selectedRole: number | null = null;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        console.log('Loaded roles:', response.data);
        this.availableRoles = response.data;
        if (!this.availableRoles.length) {
          this.error = 'No roles found. Please contact the administrator.';
        }
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.error = 'Failed to load roles. Please try again.';
      }
    });
  }

  onRoleChange(roleId: number): void {
    console.log('Role selected:', roleId);
    this.selectedRole = roleId;
    this.user.role_id = roleId;
    console.log('Updated user object:', this.user); // Debug log
  }

  onSubmit(): void {
    if (this.loading) return;
  
    this.loading = true;
    this.error = '';
  
    // Ensure a role is selected
    if (!this.selectedRole) {
      this.error = 'Please select a role';
      this.loading = false;
      return;
    }
  
    // Update the user object with the selected role
    this.user.role_id = this.selectedRole;
    console.log('Submitting user with role_id:', this.user.role_id); // Debug log
  
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating user:', error);
        this.error = error.error?.errors
          ? Object.values(error.error.errors).flat().join(', ')
          : 'Failed to create user. Please try again.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}