import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../permission.service';
import { Router } from '@angular/router';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  permissions: Permission[] = [];
  loading = true;
  error = '';

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load permissions';
        this.loading = false;
      }
    });
  }

  deletePermission(id: number): void {
    if (confirm('Are you sure?')) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => this.loadPermissions(),
        error: (error) => this.error = 'Delete failed'
      });
    }
  }

  editPermission(id: number): void {
    this.router.navigate([`/dashboard/permissions/edit/${id}`]);
  }
}