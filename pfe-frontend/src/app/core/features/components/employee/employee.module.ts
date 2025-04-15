import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// Components
import { EmployeeListComponent } from 'src/app/core/features/components/employee/employee-list/employee-list.component';
import { EmployeeCreateComponent } from 'src/app/core/features/components/employee/employee-create/employee-create.component';
import { EmployeeEditComponent } from 'src/app/core/features/components/employee/employee-edit/employee-edit.component';
import { EmployeeRoutingModule } from './employee-routing.module'; // Added


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeCreateComponent,
    EmployeeEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeeRoutingModule,
    FormsModule
  ]
})
export class EmployeeModule { }