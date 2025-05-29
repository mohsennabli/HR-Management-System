import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from '../employee/employee.service';
import { MessageService } from 'primeng/api';
import { Employee } from 'src/app/models/employee.model';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-employee-profile',
  template: `
    <div class="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h2>
            <p class="text-gray-600 mt-1">View and manage your professional information</p>
          </div>
          <p-toast position="top-right"></p-toast>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center h-64">
          <p-progressSpinner strokeWidth="4"></p-progressSpinner>
        </div>

        <div *ngIf="!isLoading && employee" class="space-y-8">
          <!-- Profile Overview Card -->
          <p-card styleClass="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ng-template pTemplate="header">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
                <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-white">
                  <i class="pi pi-user text-6xl text-blue-600"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ employee.first_name }} {{ employee.last_name }}</h3>
                <p class="text-gray-600 text-lg mb-3">{{ employee.position || 'No Position' }}</p>
                <div class="flex justify-center gap-2">
                  <p-tag *ngIf="employee.department?.name" [value]="employee.department?.name" severity="info" styleClass="text-sm px-3 py-1"></p-tag>
                </div>
              </div>
            </ng-template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <i class="pi pi-envelope text-blue-600 text-xl mr-3"></i>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium">{{ employee.email }}</p>
                </div>
              </div>
              <div class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <i class="pi pi-phone text-blue-600 text-xl mr-3"></i>
                <div>
                  <p class="text-sm text-gray-500">Phone</p>
                  <p class="font-medium">{{ employee.phone || 'Not provided' }}</p>
                </div>
              </div>
              <div class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <i class="pi pi-calendar text-blue-600 text-xl mr-3"></i>
                <div>
                  <p class="text-sm text-gray-500">Hire Date</p>
                  <p class="font-medium">{{ employee.hire_date | date:'mediumDate' }}</p>
                </div>
              </div>
              <div class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <i class="pi pi-map-marker text-blue-600 text-xl mr-3"></i>
                <div>
                  <p class="text-sm text-gray-500">Address</p>
                  <p class="font-medium">{{ employee.address || 'Not provided' }}</p>
                </div>
              </div>
            </div>
          </p-card>

          <!-- Stepper Navigation -->
          <div class="bg-white rounded-xl shadow-lg p-4">
            <p-steps [model]="steps" [activeIndex]="activeIndex" [readonly]="false" styleClass="mb-4"></p-steps>
          </div>

          <!-- Content Sections -->
          <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <!-- Personal Information -->
            <div *ngIf="activeIndex === 0" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Personal Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Birth Date</label>
                  <p class="text-gray-900 font-medium">{{ employee.birth_date ? (employee.birth_date | date:'mediumDate') : 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Birth Location</label>
                  <p class="text-gray-900 font-medium">{{ employee.birth_location || 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                  <p class="text-gray-900 font-medium">{{ employee.marital_status || 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Disabled Child</label>
                  <p-tag [value]="employee.has_disabled_child ? 'Yes' : 'No'" 
                        [severity]="employee.has_disabled_child ? 'warning' : 'success'"
                        styleClass="text-sm px-3 py-1">
                  </p-tag>
                </div>
              </div>
            </div>

            <!-- Professional Information -->
            <div *ngIf="activeIndex === 1" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Professional Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Department</label>
                  <p class="text-gray-900 font-medium">{{ employee.department?.name || 'Not assigned' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Position</label>
                  <p class="text-gray-900 font-medium">{{ employee.position || 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Salary</label>
                  <p class="text-gray-900 font-medium">{{ employee.salary ? (employee.salary | currency:'MAD':'symbol-narrow':'1.2-2') : 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Diploma</label>
                  <p class="text-gray-900 font-medium">{{ employee.diploma || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Identification Information -->
            <div *ngIf="activeIndex === 2" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Identification Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">CIN Number</label>
                  <p class="text-gray-900 font-medium">{{ employee.cin_number || 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">CIN Issue Date</label>
                  <p class="text-gray-900 font-medium">{{ employee.cin_issue_date ? (employee.cin_issue_date | date:'mediumDate') : 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">CIN Issue Location</label>
                  <p class="text-gray-900 font-medium">{{ employee.cin_issue_location || 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">CNSS Number</label>
                  <p class="text-gray-900 font-medium">{{ employee.cnss_number || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Banking Information -->
            <div *ngIf="activeIndex === 3" class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Banking Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Bank Agency</label>
                  <p class="text-gray-900 font-medium">{{ employee.bank_agency || 'Not specified' }}</p>
                </div>
                <div class="p-4 rounded-lg bg-gray-50">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Bank RIB</label>
                  <p class="text-gray-900 font-medium">{{ employee.bank_rib || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-8 pt-4 border-t">
              <p-button 
                *ngIf="activeIndex > 0"
                label="Previous" 
                icon="pi pi-arrow-left" 
                (onClick)="prevStep()"
                styleClass="p-button-secondary p-button-outlined">
              </p-button>
              <p-button 
                *ngIf="activeIndex < steps.length - 1"
                label="Next" 
                icon="pi pi-arrow-right" 
                iconPos="right"
                (onClick)="nextStep()"
                styleClass="p-button">
              </p-button>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && !employee" class="text-center py-12 bg-white rounded-xl shadow-lg">
          <i class="pi pi-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <p class="text-xl text-gray-700 mb-2">Unable to load profile information</p>
          <p class="text-gray-500">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-progressspinner {
        width: 50px;
        height: 50px;
      }
      .p-card {
        border-radius: 1rem;
        overflow: hidden;
      }
      .p-card .p-card-header {
        padding: 0;
      }
      .p-steps {
        .p-steps-item {
          .p-steps-number {
            background: #3b82f6;
            color: #ffffff;
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5rem;
            transition: all 0.2s;
          }
          .p-steps-title {
            font-weight: 500;
            color: #4b5563;
            margin-top: 0.5rem;
          }
          &.p-highlight {
            .p-steps-number {
              background: #2563eb;
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
            }
            .p-steps-title {
              color: #1e40af;
              font-weight: 600;
            }
          }
        }
      }
      .p-button {
        &.p-button-primary {
          background: #3b82f6;
          &:hover {
            background: #2563eb;
          }
        }
        &.p-button-secondary {
          &.p-button-outlined {
            border-color: #6b7280;
            color: #4b5563;
            &:hover {
              background: #f3f4f6;
            }
          }
        }
      }
      .p-tag {
        border-radius: 9999px;
        &.p-tag-info {
          background: #dbeafe;
          color: #1e40af;
        }
        &.p-tag-success {
          background: #dcfce7;
          color: #166534;
        }
        &.p-tag-warning {
          background: #fef3c7;
          color: #92400e;
        }
      }
    }
  `]
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