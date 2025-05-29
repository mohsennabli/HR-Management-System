import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../role.service';
import { RoleResponse } from 'src/app/models/role.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  providers: [MessageService]
})
export class RoleEditComponent implements OnInit {
  roleId!: number;
  name = '';
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.params['id'];
    this.loadRole();
  }

  loadRole(): void {
    this.loading = true;
    this.roleService.getRole(this.roleId).subscribe({
      next: (response: RoleResponse) => {
        this.name = response.data.name;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading role:', error);
        this.error = 'Failed to load role';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load role'
        });
      }
    });
  }

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
    this.roleService.updateRole(this.roleId, {
      name: this.name,
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Role updated successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard/roles']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error updating role:', error);
        this.error = 'Update failed';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update role'
        });
      }
    });
  }
}