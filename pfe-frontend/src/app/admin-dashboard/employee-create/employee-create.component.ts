import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent {
  user: User = { name: '', email: '', password: '', role_id: 0 };
  loading = false;
  error = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';

    this.apiService.createUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.loading = false;
        if (error.error?.errors) {
          this.error = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.error = 'Failed to create employee. Please try again.';
        }
        console.error('Error creating employee:', error);
      }
    });
  }
}