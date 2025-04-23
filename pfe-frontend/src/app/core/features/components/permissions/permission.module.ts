import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionCreateComponent } from './permission-create/permission-create.component';
import { PermissionEditComponent } from './permission-edit/permission-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PermissionListComponent,
    PermissionCreateComponent,
    PermissionEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PermissionRoutingModule
  ]
})
export class PermissionModule { }