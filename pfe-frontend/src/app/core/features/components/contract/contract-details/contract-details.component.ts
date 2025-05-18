import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { MessageService } from 'primeng/api';
import { Contract, SIVPContract, MedysisContract } from '../contract.interface';
import { EmployeeService } from '../../employee/employee.service';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  providers: [MessageService]
})
export class ContractDetailsComponent implements OnInit {
  contract: Contract | null = null;
  employee: any = null;
  loading = true;

  constructor(
    private contractService: ContractService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadContract(+params['id']);
      }
    });
  }

  loadContract(id: number): void {
    this.loading = true;
    this.contractService.getContractById(id).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.loadEmployee(contract.employee_id);
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

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employee details'
        });
      }
    });
  }

  onEdit(): void {
    if (this.contract?.id) {
      this.router.navigate(['/dashboard/contracts/edit', this.contract.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/dashboard/contracts']);
  }

  isSIVPContract(contract: Contract): contract is SIVPContract {
    return !('type' in contract);
  }
} 