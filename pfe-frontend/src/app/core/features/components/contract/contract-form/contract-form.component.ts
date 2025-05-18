import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { MessageService } from 'primeng/api';
import { Contract, SIVPContract, MedysisContract } from '../contract.interface';
import { EmployeeService } from '../../employee/employee.service';
import { SelectButtonChangeEvent } from 'primeng/selectbutton';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  providers: [MessageService]
})
export class ContractFormComponent implements OnInit {
  contractForm: FormGroup;
  isEditMode = false;
  contractId: number | null = null;
  contractType: 'sivp' | 'medysis' = 'sivp';
  employees: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.contractForm = this.fb.group({
      employee_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pattern: ['', Validators.required],
      // SIVP specific fields
      duration: [null],
      sign: [''],
      breakup: [''],
      // Medysis specific fields
      type: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contractId = +params['id'];
        this.loadContract(this.contractId);
      }
    });
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employees'
        });
        this.loading = false;
      }
    });
  }

  loadContract(id: number): void {
    this.loading = true;
    this.contractService.getContractById(id).subscribe({
      next: (contract) => {
        this.contractType = 'type' in contract ? 'medysis' : 'sivp';
        const formData = {
          ...contract,
          start_date: new Date(contract.start_date),
          end_date: new Date(contract.end_date)
        };
        this.contractForm.patchValue(formData);
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

  onSubmit(): void {
    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;
      
      if (this.contractType === 'sivp') {
        const sivpContract: SIVPContract = {
          employee_id: formValue.employee_id,
          start_date: formValue.start_date,
          end_date: formValue.end_date,
          pattern: formValue.pattern,
          duration: formValue.duration,
          sign: formValue.sign,
          breakup: formValue.breakup
        };

        if (this.isEditMode && this.contractId) {
          this.contractService.updateContract(this.contractId, sivpContract).subscribe({
            next: () => this.handleSuccess('Contract updated successfully'),
            error: () => this.handleError('Failed to update contract')
          });
        } else {
          this.contractService.createSIVPContract(sivpContract).subscribe({
            next: () => this.handleSuccess('Contract created successfully'),
            error: () => this.handleError('Failed to create contract')
          });
        }
      } else {
        const medysisContract: MedysisContract = {
          employee_id: formValue.employee_id,
          start_date: formValue.start_date,
          end_date: formValue.end_date,
          pattern: formValue.pattern,
          type: formValue.type
        };

        if (this.isEditMode && this.contractId) {
          this.contractService.updateContract(this.contractId, medysisContract).subscribe({
            next: () => this.handleSuccess('Contract updated successfully'),
            error: () => this.handleError('Failed to update contract')
          });
        } else {
          this.contractService.createMedysisContract(medysisContract).subscribe({
            next: () => this.handleSuccess('Contract created successfully'),
            error: () => this.handleError('Failed to create contract')
          });
        }
      }
    }
  }

  private handleSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message
    });
    this.router.navigate(['/dashboard/contracts']);
  }

  private handleError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  onTypeChange(event: SelectButtonChangeEvent): void {
    const type = event.value as 'sivp' | 'medysis';
    this.contractType = type;
    
    // Reset form controls
    this.contractForm.patchValue({
      duration: null,
      sign: '',
      breakup: '',
      type: ''
    });

    if (type === 'sivp') {
      this.contractForm.get('type')?.clearValidators();
      this.contractForm.get('duration')?.setValidators([Validators.required]);
      this.contractForm.get('sign')?.setValidators([Validators.required]);
      this.contractForm.get('breakup')?.setValidators([Validators.required]);
    } else {
      this.contractForm.get('duration')?.clearValidators();
      this.contractForm.get('sign')?.clearValidators();
      this.contractForm.get('breakup')?.clearValidators();
      this.contractForm.get('type')?.setValidators([Validators.required]);
    }

    this.contractForm.get('duration')?.updateValueAndValidity();
    this.contractForm.get('sign')?.updateValueAndValidity();
    this.contractForm.get('breakup')?.updateValueAndValidity();
    this.contractForm.get('type')?.updateValueAndValidity();
  }
} 