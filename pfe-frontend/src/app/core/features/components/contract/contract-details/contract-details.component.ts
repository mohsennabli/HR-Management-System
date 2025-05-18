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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContract(Number(id));
    }
  }

  loadContract(id: number): void {
    this.loading = true;
    this.contractService.getContractById(id).subscribe({
      next: (data) => {
        this.contract = data;
        this.loadEmployee(data.employee_id);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contract details'
        });
        this.loading = false;
      }
    });
  }

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (response) => {
        this.employee = response.data;
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
    if (this.contract) {
      this.router.navigate(['/dashboard/contracts/edit', this.contract.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/dashboard/contracts']);
  }

  isSIVPContract(contract: Contract): contract is SIVPContract {
    return 'duration' in contract && 'sign' in contract && 'breakup' in contract;
  }

  isMedysisContract(contract: Contract): contract is MedysisContract {
    return 'type' in contract;
  }
} 