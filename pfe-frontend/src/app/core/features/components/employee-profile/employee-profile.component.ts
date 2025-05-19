import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from '../employee/employee.service';
import { MessageService } from 'primeng/api';
import { Employee } from 'src/app/models/employee.model';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-employee-profile',
  template: `
    <div class="p-4 bg-gray-50 min-h-screen">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">My Profile</h2>
          <p-toast></p-toast>
        </div>

        <div *ngIf="isLoading" class="flex justify-center items-center h-64">
          <p-progressSpinner></p-progressSpinner>
        </div>

        <div *ngIf="!isLoading && employee" class="space-y-6">
          <!-- Profile Overview Card -->
          <p-card styleClass="h-full">
            <ng-template pTemplate="header">
              <div class="bg-blue-50 p-6 text-center">
                <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-user text-6xl text-blue-500"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">{{ employee?.first_name }} {{ employee?.last_name }}</h3>
                <p class="text-gray-600">{{ employee?.position ?? 'No Position' }}</p>
                <p-tag *ngIf="employee?.department?.name" [value]="employee?.department?.name" severity="info" class="mt-2"></p-tag>
              </div>
            </ng-template>

            <div class="space-y-4">
              <div class="flex items-center text-gray-600">
                <i class="pi pi-envelope mr-2"></i>
                <span>{{ employee?.email }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-phone mr-2"></i>
                <span>{{ employee?.phone || 'No phone number' }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-calendar mr-2"></i>
                <span>Hired: {{ employee?.hire_date | date:'mediumDate' }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-map-marker mr-2"></i>
                <span>{{ employee?.address || 'No address' }}</span>
              </div>
            </div>
          </p-card>

          <!-- Stepper Navigation -->
          <p-steps [model]="steps" [activeIndex]="activeIndex" [readonly]="false" styleClass="mb-4"></p-steps>

          <!-- Content Sections -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <!-- Personal Information -->
            <div *ngIf="activeIndex === 0">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Birth Date</label>
                  <p class="text-gray-900">{{ employee?.birth_date ? (employee.birth_date | date:'mediumDate') : 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Birth Location</label>
                  <p class="text-gray-900">{{ employee?.birth_location || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                  <p class="text-gray-900">{{ employee?.marital_status || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Disabled Child</label>
                  <p-tag [value]="employee?.has_disabled_child ? 'Yes' : 'No'" 
                        [severity]="employee?.has_disabled_child ? 'warning' : 'success'">
                  </p-tag>
                </div>
              </div>
            </div>

            <!-- Professional Information -->
            <div *ngIf="activeIndex === 1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Department</label>
                  <p class="text-gray-900">{{ employee?.department?.name || 'Not assigned' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Position</label>
                  <p class="text-gray-900">{{ employee?.position || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Salary</label>
                  <p class="text-gray-900">{{ employee?.salary ? (employee.salary | currency:'MAD':'symbol-narrow':'1.2-2') : 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Diploma</label>
                  <p class="text-gray-900">{{ employee?.diploma || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Identification Information -->
            <div *ngIf="activeIndex === 2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">CIN Number</label>
                  <p class="text-gray-900">{{ employee?.cin_number || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">CIN Issue Date</label>
                  <p class="text-gray-900">{{ employee?.cin_issue_date ? (employee.cin_issue_date | date:'mediumDate') : 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">CIN Issue Location</label>
                  <p class="text-gray-900">{{ employee?.cin_issue_location || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">CNSS Number</label>
                  <p class="text-gray-900">{{ employee?.cnss_number || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Banking Information -->
            <div *ngIf="activeIndex === 3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Bank Agency</label>
                  <p class="text-gray-900">{{ employee?.bank_agency || 'Not specified' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Bank RIB</label>
                  <p class="text-gray-900">{{ employee?.bank_rib || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-6">
              <p-button 
                *ngIf="activeIndex > 0"
                label="Previous" 
                icon="pi pi-arrow-left" 
                (onClick)="prevStep()"
                styleClass="p-button-secondary">
              </p-button>
              <p-button 
                *ngIf="activeIndex < steps.length - 1"
                label="Next" 
                icon="pi pi-arrow-right" 
                iconPos="right"
                (onClick)="nextStep()"
                styleClass="p-button-primary">
              </p-button>
            </div>
          </div>
        </div>

        <div *ngIf="!isLoading && !employee" class="text-center py-8">
          <p class="text-gray-500">Unable to load profile information</p>
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
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      }
      .p-card .p-card-header {
        background-color: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }
      .p-card .p-card-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
      }
      .p-steps .p-steps-item .p-steps-number {
        background: #3b82f6;
        color: #ffffff;
      }
      .p-steps .p-steps-item.p-highlight .p-steps-number {
        background: #2563eb;
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
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Employee profile not found'
                });
              }
              this.isLoading = false;
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load employee profile'
              });
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