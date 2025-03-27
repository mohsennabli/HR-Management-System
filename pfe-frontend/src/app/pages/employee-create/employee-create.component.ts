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
  user: User = { name: '', email: '', password: '', role_id: 0 }; // Added password

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    this.apiService.createUser(this.user).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }
}