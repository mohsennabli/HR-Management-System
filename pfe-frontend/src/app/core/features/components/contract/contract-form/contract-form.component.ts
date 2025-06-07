import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { EmployeeService } from '../../employee/employee.service';
import { MessageService } from 'primeng/api';
import { Contract, SIVPContract, MedysisContract } from '../contract.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  providers: [MessageService]
})
export class ContractFormComponent implements OnInit, OnDestroy {
  contractForm: FormGroup;
  employees: any[] = [];
  loading: boolean = false;
  isEditMode: boolean = false;
  contractId: number | null = null;
  contractType: 'sivp' | 'medysis' = 'sivp';
  private dateSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contractForm = this.fb.group({
      employee_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pattern: ['full_time', Validators.required],
      // SIVP specific fields
      duration: [{value: null, disabled: true}],
      sign: [''],
      breakup: [''],
      // Medysis specific fields
      type: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.contractId;

    if (this.isEditMode) {
      this.loadContract();
    }

    // Subscribe to contract type changes
    this.route.queryParams.subscribe(params => {
      this.contractType = params['type'] || 'sivp';
      this.updateFormValidation();
    });

    // Subscribe to date changes to calculate duration
    this.dateSubscription = this.contractForm.valueChanges.subscribe(() => {
      this.calculateDuration();
    });
  }

  ngOnDestroy(): void {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  calculateDuration(): void {
    const startDate = this.contractForm.get('start_date')?.value;
    const endDate = this.contractForm.get('end_date')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Calculate months between dates
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
      
      // Add partial month if end date is not at the start of the month
      const partialMonth = end.getDate() > start.getDate() ? 1 : 0;
      
      const totalMonths = months + partialMonth;
      
      // Update duration field if it's a valid number
      if (totalMonths > 0) {
        this.contractForm.get('duration')?.setValue(totalMonths, { emitEvent: false });
      }
    }
  }

  updateFormValidation(): void {
    if (this.contractType === 'sivp') {
      this.contractForm.get('duration')?.setValidators([Validators.required]);
      this.contractForm.get('sign')?.setValidators([Validators.required]);
      this.contractForm.get('breakup')?.setValidators([Validators.required]);
      this.contractForm.get('type')?.clearValidators();
    } else {
      this.contractForm.get('type')?.setValidators([Validators.required]);
      this.contractForm.get('duration')?.clearValidators();
      this.contractForm.get('sign')?.clearValidators();
      this.contractForm.get('breakup')?.clearValidators();
    }

    // Update validation status
    this.contractForm.get('duration')?.updateValueAndValidity();
    this.contractForm.get('sign')?.updateValueAndValidity();
    this.contractForm.get('breakup')?.updateValueAndValidity();
    this.contractForm.get('type')?.updateValueAndValidity();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (response) => {
        this.employees = response.data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employees'
        });
      }
    });
  }

  loadContract(): void {
    if (this.contractId) {
      this.loading = true;
      this.contractService.getContractById(this.contractId).subscribe({
        next: (data) => {
          this.contractForm.patchValue(data);
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load contract'
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.contractForm.valid) {
      this.loading = true;
      const formData = { ...this.contractForm.getRawValue() };

      // Extract employee_id if it's an object
      if (formData.employee_id && typeof formData.employee_id === 'object') {
        formData.employee_id = formData.employee_id.id;
      }

      // Format dates to ISO string
      formData.start_date = new Date(formData.start_date).toISOString();
      formData.end_date = new Date(formData.end_date).toISOString();

      // Remove any undefined or null values
      Object.keys(formData).forEach(key => {
        if (formData[key] === undefined || formData[key] === null) {
          delete formData[key];
        }
      });

      console.log('Submitting contract data:', formData);

      let request$;
      if (this.contractType === 'sivp') {
        request$ = this.isEditMode
          ? this.contractService.updateContract(this.contractId!, formData)
          : this.contractService.createSIVPContract(formData);
      } else {
        // For Medysis contracts, ensure type is a string
        if (formData.type) {
          // If type is an object (from PrimeNG dropdown), extract the value
          if (typeof formData.type === 'object' && formData.type !== null) {
            formData.type = formData.type.value || formData.type.name;
          }
          // Ensure type is one of the valid values
          if (!['permanent', 'temporary', 'internship'].includes(formData.type)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Invalid contract type'
            });
            this.loading = false;
            return;
          }
        }

        // Ensure pattern is one of the valid values
        if (!['full_time', 'part_time'].includes(formData.pattern)) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid pattern value. Must be full_time or part_time'
          });
          this.loading = false;
          return;
        }

        request$ = this.isEditMode
          ? this.contractService.updateContract(this.contractId!, formData)
          : this.contractService.createMedysisContract(formData);
      }

      request$.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Contract ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.router.navigate(['/dashboard/contracts']);
        },
        error: (error) => {
          console.error('Contract submission error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to save contract'
          });
          this.loading = false;
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/contracts']);
  }
} 