import { Component } from '@angular/core';
import { PermissionService } from '../permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permission-create',
  templateUrl: './permission-create.component.html',
  styleUrls: ['./permission-create.component.scss']
})
export class PermissionCreateComponent {
  name = '';
  loading = false;
  error = '';

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.permissionService.createPermission({ name: this.name }).subscribe({
      next: () => this.router.navigate(['/admin/permissions']),
      error: (error) => {
        this.error = 'Creation failed';
        this.loading = false;
      }
    });
  }
}