import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from 'src/app/core/features/components/roles/role.service'; // Add this import
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
    roles: [] 
  };
  selectedRoles: number[] = [];
  loading = false;
  error = '';
  loadingUser = false;
  availableRoles: any[] = [];

  constructor(
    private userService: UserService,
    private roleService: RoleService, // Add this
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles(); // Load available roles first
    
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
        // Map the user's roles to selectedRoles
        this.selectedRoles = this.user.roles.map(role => role.id);
        this.loadingUser = false;
      },
      error: (error: any) => {
        this.loadingUser = false;
        this.error = error.error?.errors ? 
          Object.values(error.error.errors).flat().join(', ') : 
          'Failed to load user. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.loading || !this.user.id) return;
    
    this.loading = true;
    this.error = '';

    // Update user's roles with selectedRoles
    this.user.roles = this.selectedRoles.map(roleId => ({ id: roleId, name: '' }));

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.errors ? 
          Object.values(error.error.errors).flat().join(', ') : 
          'Failed to update user. Please try again.';
      }
    });
  }
}