import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from '../features/components/employee/employee-list/employee-list.component';
import { EmployeeCreateComponent } from '../features/components/employee/employee-create/employee-create.component';
import { EmployeeEditComponent } from '../features/components/employee/employee-edit/employee-edit.component';

const routes: Routes = [
  {
    path: '', // This will be relative to parent route
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'create', component: EmployeeCreateComponent },
      { path: 'edit/:id', component: EmployeeEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedEmployeeRoutingModule { }