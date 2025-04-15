import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';

const routes: Routes = [
  { 
    path: '', 
    component: EmployeeListComponent,
    data: { title: 'Employee List' } 
  },
  { 
    path: 'create', 
    component: EmployeeCreateComponent,
    data: { title: 'Create Employee' } 
  },
  { 
    path: 'edit/:id', 
    component: EmployeeEditComponent,
    data: { title: 'Edit Employee' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }