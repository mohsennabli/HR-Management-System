import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleCreateComponent,
    RoleEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }