import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { Contract } from '../contract.interface';
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
    this.contractService.getAllContracts().subscribe({
      next: (data) => {
        this.contracts = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contracts'
        });
        this.loading = false;
      }
    });
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