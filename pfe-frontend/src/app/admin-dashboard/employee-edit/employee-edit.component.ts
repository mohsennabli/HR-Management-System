import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  user: User = { name: '', email: '', password: '', role_id: 0 };
  loading = false;
  error = '';
  loadingUser = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadingUser = true;
      this.apiService.getUser(+id).subscribe({
        next: (response: any) => {
          this.user = response.data;
          this.loadingUser = false;
        },
        error: (error: any) => {
          this.loadingUser = false;
          if (error.error?.errors) {
            this.error = Object.values(error.error.errors).flat().join(', ');
          } else {
            this.error = 'Failed to load employee. Please try again.';
          }
          console.error('Error fetching user:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.loading || !this.user.id) return;
    
    this.loading = true;
    this.error = '';

    this.apiService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error: any) => {
        this.loading = false;
        if (error.error?.errors) {
          this.error = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.error = 'Failed to update employee. Please try again.';
        }
        console.error('Error updating user:', error);
      }
    });
  }
}