import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  user: User = { 
    name: '', 
    email: '', 
    password: '', 
    roles: [] 
  };
  availableRoles: Role[] = [];
  selectedRoles: number[] = [];
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
        this.availableRoles = response.data;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.error = 'Failed to load roles. Please try again.';
      }
    });
  }

  onRoleChange(event: any, roleId: number): void {
    if (event.target.checked) {
      this.selectedRoles.push(roleId);
    } else {
      this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
    }
  }

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';

    const userData : any= {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      roles: this.selectedRoles
    };

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        this.loading = false;
        if (error.error?.errors) {
          this.error = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.error = 'Failed to create user. Please try again.';
        }
        console.error('Error creating user:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}