import { Component } from '@angular/core';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  providers: [MessageService]
})
export class RoleCreateComponent {
  name = '';
  loading = false;
  error = '';

  constructor(
    private roleService: RoleService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit(): void {
    if (!this.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Role name is required'
      });
      return;
    }

    this.loading = true;
    this.roleService.createRole({
      name: this.name
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Role created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard/roles']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating role:', error);
        this.error = 'Creation failed';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create role'
        });
      }
    });
  }
}