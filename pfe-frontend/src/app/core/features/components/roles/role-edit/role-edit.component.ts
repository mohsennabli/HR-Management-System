import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../role.service';
import { PermissionService } from '../../permissions/permission.service';
import { RoleResponse } from 'src/app/models/role.model';
import { PermissionsResponse } from 'src/app/models/permission.model';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {
  roleId!: number;
  name = '';
  permissions: any[] = [];
  selectedPermissions: number[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.params['id'];
    this.loadRole();
    this.loadPermissions();
  }

  loadRole(): void {
    this.roleService.getRole(this.roleId).subscribe({
      next: (response: RoleResponse) => {
        this.name = response.data.name;
        this.selectedPermissions = response.data.permissions?.map(p => p.id) || [];
      },
      error: (error) => this.error = 'Failed to load role'
    });
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (response: PermissionsResponse) => {
        this.permissions = response.data;
      },
      error: (error) => this.error = 'Failed to load permissions'
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.roleService.updateRole(this.roleId, {
      name: this.name,
      permissions: this.selectedPermissions
    }).subscribe({
      next: () => this.router.navigate(['/dashboard/roles']),
      error: (error) => {
        this.error = 'Update failed';
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