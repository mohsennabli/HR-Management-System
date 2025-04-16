import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedEmployeeRoutingModule } from 'src/app/core/shared/shared-employee-routing.module'; // Updated import path
import { EmployeeListComponent } from '../features/components/employee/employee-list/employee-list.component';
import { EmployeeCreateComponent } from '../features/components/employee/employee-create/employee-create.component';
import { EmployeeEditComponent } from '../features/components/employee/employee-edit/employee-edit.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeCreateComponent,
    EmployeeEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedEmployeeRoutingModule
  ]
})
export class SharedEmployeeModule { }