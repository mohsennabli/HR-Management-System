import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionCreateComponent } from './permission-create/permission-create.component';
import { PermissionEditComponent } from './permission-edit/permission-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PermissionListComponent },
  { path: 'create', component: PermissionCreateComponent },
  { path: 'edit/:id', component: PermissionEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }