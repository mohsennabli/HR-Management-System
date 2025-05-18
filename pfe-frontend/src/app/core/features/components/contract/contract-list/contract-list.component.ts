import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { Contract, SIVPContract, MedysisContract } from '../contract.interface';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];
  loading: boolean = true;

  constructor(
    private contractService: ContractService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.loading = true;
    console.log('Loading contracts...');
    this.contractService.getAllContracts().subscribe({
      next: (data) => {
        console.log('Received data:', data);
        if (Array.isArray(data)) {
          this.contracts = data;
          console.log('Contracts loaded:', this.contracts);
        } else {
          this.contracts = [];
          console.error('Expected array of contracts but got:', data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contracts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contracts'
        });
        this.loading = false;
        this.contracts = [];
      }
    });
  }

  getContractType(contract: Contract): string {
    if ('type' in contract) {
      return 'Medysis';
    } else if ('duration' in contract) {
      return 'SIVP';
    }
    return 'Base';
  }

  onDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contract?',
      accept: () => {
        this.contractService.deleteContract(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Contract deleted successfully'
            });
            this.loadContracts();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete contract'
            });
          }
        });
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/dashboard/contracts/edit', id]);
  }

  onView(id: number): void {
    this.router.navigate(['/dashboard/contracts', id]);
  }

  onNew(): void {
    this.router.navigate(['/dashboard/contracts/new']);
  }
} 