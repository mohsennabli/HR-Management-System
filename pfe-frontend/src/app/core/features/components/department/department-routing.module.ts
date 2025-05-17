import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentCreateComponent } from './department-create/department-create.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DepartmentListComponent },
      { path: 'create', component: DepartmentCreateComponent },
      { path: 'edit/:id', component: DepartmentEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { } 