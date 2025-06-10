import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from '../employee/employee.service';
import { MessageService } from 'primeng/api';
import { Employee } from 'src/app/models/employee.model';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee | null = null;
  isLoading: boolean = true;
  activeIndex: number = 0;
  steps: MenuItem[] = [
    { label: 'Personal' },
    { label: 'Professional' },
    { label: 'Identification' },
    { label: 'Banking' }
  ];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeProfile();
  }

  nextStep(): void {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  private loadEmployeeProfile(): void {
    this.isLoading = true;
    
    this.authService.getLoggedInUser().subscribe({
      next: (user) => {
        if (user && user.employee_id) {
          // Get the employee information using the employee_id
          this.employeeService.getById(user.employee_id).subscribe({
            next: (response) => {
              if (response.data) {
                this.employee = response.data;
              } else {
                // If no employee record found, create a simplified profile for admin
                this.employee = {
                  id: user.id,
                  first_name: user.name.split(' ')[0] || user.name,
                  last_name: user.name.split(' ').slice(1).join(' ') || '',
                  email: user.email,
                  position: 'Administrator',
                  role_id: user.role_id,
                  is_user: true,
                  user: {
                    id: user.id,
                    email: user.email,
                    role_id: user.role_id
                  }
                } as Employee;
              }
              this.isLoading = false;
            },
            error: (error) => {
              // If error occurs, create a simplified profile for admin
              this.employee = {
                id: user.id,
                first_name: user.name.split(' ')[0] || user.name,
                last_name: user.name.split(' ').slice(1).join(' ') || '',
                email: user.email,
                position: 'Administrator',
                role_id: user.role_id,
                is_user: true,
                user: {
                  id: user.id,
                  email: user.email,
                  role_id: user.role_id
                }
              } as Employee;
              this.isLoading = false;
            }
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User is not associated with an employee account'
          });
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get logged in user information'
        });
        this.isLoading = false;
      }
    });
  }
} 