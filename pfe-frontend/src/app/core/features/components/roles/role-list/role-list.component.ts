import { Component, OnInit } from '@angular/core';
import { RoleService } from '../role.service';
import { Role } from 'src/app/models/role.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  loading = true;
  error = '';

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = '';
    
    this.roleService.getRoles().subscribe({
      next: (response) => {
        console.log('Roles API Response:', response); // Log full response for debugging
        
        // Check if the response contains data
        if (response && Array.isArray(response.data)) {
          this.roles = response.data.map(role => {
            console.log('Processing role:', role); // Log each role being processed
            console.log('Role permissions:', role.permissions); // Log permissions for each role
            return {
              ...role,
              permissions: role.permissions || [] // Default permissions to an empty array
            };
          });
          console.log('Final processed Roles:', this.roles); // Log final processed roles
        } else {
          console.warn('Invalid response structure:', response);
          this.error = 'Failed to load roles';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
        this.error = 'Server error - please try again later';
        this.loading = false;
      }
    });
  }

  deleteRole(id: number): void {
    if (confirm('Are you sure?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => this.loadRoles(),
        error: (error) => {
          console.error('Failed to delete role:', error);
          this.error = 'Delete failed';
        }
      });
    }
  }

  editRole(id: number): void {
    this.router.navigate([`/roles/edit/${id}`]);
  }
}