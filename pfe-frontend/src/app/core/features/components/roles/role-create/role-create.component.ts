import { Component } from '@angular/core';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent {
  name = '';
  loading = false;
  error = '';

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {
  }


 
  onSubmit(): void {
    this.loading = true;
    this.roleService.createRole({
      name: this.name,
      permissions: []
    }).subscribe({
      next: () => this.router.navigate(['/dashboard/roles']),
      error: (error) => {
        this.error = 'Creation failed';
        this.loading = false;
      }
    });
  }

 
}