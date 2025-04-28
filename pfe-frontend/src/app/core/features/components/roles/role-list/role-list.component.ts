import { Component, OnInit } from '@angular/core';
import { RoleService } from '../role.service';
import { Role, RolesResponse } from 'src/app/models/role.model';
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
        if (response.success) {
          this.roles = response.data;
        } else {
          this.error = response.message || 'Failed to load roles';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Server error - please try again later';
        this.loading = false;
        console.error('API Error:', error);
      }
    });
  }
  deleteRole(id: number): void {
    if (confirm('Are you sure?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => this.loadRoles(),
        error: (error) => this.error = 'Delete failed'
      });
    }
  }

  editRole(id: number): void {
    this.router.navigate([`/roles/edit/${id}`]);
  }
}