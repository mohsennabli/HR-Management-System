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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getUser(+id).subscribe(
        (response: any) => { // Add type
          this.user = response.data;
        },
        (error: any) => { // Add type
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.user.id) {
      this.apiService.updateUser(this.user.id, this.user).subscribe(
        (response: any) => { // Add type
          this.router.navigate(['/employees']);
        },
        (error: any) => { // Add type
          console.error('Error updating user:', error);
        }
      );
    }
  }
}