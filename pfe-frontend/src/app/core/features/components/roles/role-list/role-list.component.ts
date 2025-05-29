import { Component, OnInit } from '@angular/core';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { UserService } from 'src/app/core/features/components/user/user.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  loading = false;
  error = '';

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.error = 'Failed to load roles';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles'
        });
      }
    });
  }

  editRole(id: number): void {
    this.router.navigate(['/dashboard/roles/edit', id]);
  }

  deleteRole(id: number): void {
    // First check if there are users with this role
    this.userService.getUsersByRole(id).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Cannot Delete Role',
            detail: `This role is assigned to ${response.data.length} user(s). Please reassign these users before deleting the role.`
          });
          return;
        }

        // If no users have this role, proceed with deletion confirmation
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete this role?',
          accept: () => {
            this.roleService.deleteRole(id).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Role deleted successfully'
                });
                this.loadRoles();
              },
              error: (error) => {
                console.error('Failed to delete role:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to delete role'
                });
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error checking users with role:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check if role is in use'
        });
      }
    });
  }

  getPermissionCountText(count: number): string {
    return `${count || 0} ${count === 1 ? 'Permission' : 'Permissions'}`;
  }
}