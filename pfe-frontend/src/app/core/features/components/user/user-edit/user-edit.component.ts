import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  user: User = { 
    name: '', 
    email: '', 
    password: '', 
    role_id: null  // Initialize as null instead of undefined
  };
  selectedRole: number | null = null;
  loading = false;
  error = '';
  loadingUser = false;
  availableRoles: any[] = [];

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(+id);
    }
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.availableRoles = response.data || response;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  loadUser(id: number): void {
    this.loadingUser = true;
    this.userService.getUser(id).subscribe({
      next: (response: any) => {
        this.user = response.data;
        this.selectedRole = this.user.role_id ?? null; // Pre-select role
        this.loadingUser = false;
      },
      error: (error: any) => {
        this.loadingUser = false;
        this.error = error.error?.errors
          ? Object.values(error.error.errors).flat().join(', ')
          : 'Failed to load user. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.loading || !this.user.id) return;
  
    this.loading = true;
    this.error = '';
  
    const userData: any = {
      name: this.user.name,
      email: this.user.email,
      role_id: this.selectedRole, // Send only selected role
    };
  
    if (this.user.password) {
      userData.password = this.user.password; // Include password only if provided
    }
  
    this.userService.updateUser(this.user.id, userData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.errors
          ? Object.values(error.error.errors).flat().join(', ')
          : 'Failed to update user. Please try again.';
      }
    });
  }
}