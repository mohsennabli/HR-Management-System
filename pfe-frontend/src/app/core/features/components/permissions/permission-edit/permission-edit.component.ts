import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../permission.service';

@Component({
  selector: 'app-permission-edit',
  templateUrl: './permission-edit.component.html',
  styleUrls: ['./permission-edit.component.scss']
})
export class PermissionEditComponent implements OnInit {
  permissionId!: number;
  name = '';
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permissionId = +this.route.snapshot.params['id'];
    this.loadPermission();
  }

  loadPermission(): void {
    this.permissionService.getPermission(this.permissionId).subscribe({
      next: (perm) => this.name = perm.name,
      error: (error) => this.error = 'Failed to load permission'
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.permissionService.updatePermission(this.permissionId, { name: this.name })
      .subscribe({
        next: () => this.router.navigate(['/admin/permissions']),
        error: (error) => {
          this.error = 'Update failed';
          this.loading = false;
        }
      });
  }
}