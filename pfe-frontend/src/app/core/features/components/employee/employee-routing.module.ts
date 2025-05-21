import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { AdminRhGuard } from 'src/app/guards/Admin-RhGuard.guard';

const routes: Routes = [
  { path: '', component: EmployeeListComponent},
  { path: 'create', component: EmployeeCreateComponent },
  { path: 'edit/:id', component: EmployeeEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { } 