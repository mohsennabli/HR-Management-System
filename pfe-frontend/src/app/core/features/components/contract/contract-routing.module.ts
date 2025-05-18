import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractFormComponent } from './contract-form/contract-form.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';

const routes: Routes = [
  {
    path: '',
    component: ContractListComponent
  },
  {
    path: 'new',
    component: ContractFormComponent
  },
  {
    path: 'edit/:id',
    component: ContractFormComponent
  },
  {
    path: ':id',
    component: ContractDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { } 