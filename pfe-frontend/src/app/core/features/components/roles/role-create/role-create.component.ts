import { Component } from '@angular/core';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';
import { PermissionService } from '../../permissions/permission.service';
import { Permission, PermissionsResponse } from 'src/app/models/permission.model';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent {
  name = '';
  permissions: Permission[] = []; // Properly typed
  selectedPermissions: number[] = [];
  loading = false;
  error = '';

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.loadPermissions();
  }


  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (response: PermissionsResponse) => {
        this.permissions = response.data; // Now properly typed
      },
      error: (error) => this.error = 'Failed to load permissions'
    });
  }
  onSubmit(): void {
    this.loading = true;
    this.roleService.createRole({
      name: this.name,
      permissions: this.selectedPermissions
    }).subscribe({
      next: () => this.router.navigate(['/admin/roles']),
      error: (error) => {
        this.error = 'Creation failed';
        this.loading = false;
      }
    });
  }

  togglePermission(permId: number): void {
    const index = this.selectedPermissions.indexOf(permId);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permId);
    }
  }
}